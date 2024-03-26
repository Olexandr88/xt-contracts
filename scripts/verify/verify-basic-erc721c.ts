import hre from "hardhat";

const main = async () => {
  await hre.run("verify:verify", {
    address: "0x3CdFE680f802036Da70C7E19eCf3781789695F9d",
    constructorArguments: [
      "PalioAI START",
      "PAS",
      "https://api.xter.io/asset/nft/meta/xterio_testnet",
      "0xB6Fe7Bc1c8836983C0643D5869c42bD27aCAAedD",
      "0xB4c7E393619E0924e6B3dbc718B7e2a29A123529",
      0
    ],
    contract: "contracts/basic-tokens/BasicERC721C.sol:BasicERC721C",
  });
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
