import hre from "hardhat";
import { MarketplaceV2, TokenGateway } from "../typechain-types";
import { AddressLike, Overrides } from "ethers";
import { NonPayableOverrides } from "../typechain-types/common";

export const deployMajorToken = async (wallet: AddressLike) => {
  const Token = await hre.ethers.getContractFactory("XterToken");
  const token = await Token.deploy(wallet);
  await token.waitForDeployment();
  return token;
};

export const deployGateway = async (gatewayAdmin: AddressLike, txOverrides?: Overrides) => {
  const Contract = await hre.ethers.getContractFactory("TokenGateway");
  const contract = (await hre.upgrades.deployProxy(Contract, [gatewayAdmin]),
  txOverrides ? { txOverrides } : undefined) as unknown as TokenGateway;
  await contract.waitForDeployment();
  return contract;
};

export const deployMarketplaceV2 = async (
  gateway: AddressLike,
  serviceFeeRecipient: AddressLike,
  paymentToken?: AddressLike
) => {
  const Contract = await hre.ethers.getContractFactory("MarketplaceV2");
  const contract = (await hre.upgrades.deployProxy(Contract)) as unknown as MarketplaceV2;
  await contract.waitForDeployment();

  // Initialize the marketplace contract.
  if (paymentToken) {
    await contract.addPaymentTokens([paymentToken]);
  }
  await contract.setServiceFeeRecipient(serviceFeeRecipient);
  // Marketplace will in `atomicMatchAndDeposit` query the manager address of a token.
  await contract.setGateway(gateway);

  return contract;
};

export const deployForwarder = async (txOverrides?: NonPayableOverrides & { from?: string }) => {
  const Contract = await hre.ethers.getContractFactory("Forwarder");
  const contract = await Contract.deploy(txOverrides || {});
  await contract.waitForDeployment();
  return contract;
};

export const deployWhitelistMinter = async (
  gateway: AddressLike,
  txOverrides?: NonPayableOverrides & { from?: string }
) => {
  const Contract = await hre.ethers.getContractFactory("WhitelistMinter");
  const contract = await Contract.deploy(gateway, txOverrides || {});
  await contract.waitForDeployment();
  return contract;
};

export const deployLootboxUnwrapper = async (gateway: AddressLike) => {
  const Contract = await hre.ethers.getContractFactory("LootboxUnwrapper");
  const contract = await Contract.deploy(gateway);
  await contract.waitForDeployment();
  return contract;
};

export const deployCreatorTokenTransferValidator = async (defaultOwner: AddressLike) => {
  const Contract = await hre.ethers.getContractFactory("CreatorTokenTransferValidator");
  const contract = await Contract.deploy(defaultOwner);
  await contract.waitForDeployment();
  return contract;
};
