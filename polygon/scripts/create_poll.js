const { ethers } = require("hardhat");
require("dotenv").config();

async function create_poll() {
  const votingDappAddress = process.env.CONTRACT_ADDRESS; // Replace with your deployed contract's address

  const VotingDapp = await ethers.getContractFactory("VotingDapp");
  const votingDapp = await VotingDapp.attach(votingDappAddress);

  const pollTitle = "Should we have a pizza party?";
  const pollDescription = "Vote for your favorite pizza toppings!";
  const pollDuration = 60 * 60 * 24; // 24 hours in seconds

  const tx = await votingDapp.createPoll(pollTitle, pollDescription, pollDuration);

  console.log(`Transaction hash: ${tx.hash}`);
  await tx.wait();

  console.log("Poll created successfully!");
}

create_poll();
