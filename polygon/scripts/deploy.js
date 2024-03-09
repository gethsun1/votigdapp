const hre = require("hardhat");

async function main() {
  const VotingDappFactory = await hre.ethers.getContractFactory("VotingDapp");
  const votingDapp = await VotingDappFactory.deploy();

  await votingDapp.deployed();

  console.log("VotingDapp deployed to:", votingDapp.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
