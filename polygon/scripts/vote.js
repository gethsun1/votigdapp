// scripts/vote.js
const { ethers } = require("hardhat");
require("dotenv").config();



async function getCandidates(pollId) {
  const votingDappAddress = process.env.CONTRACT_ADDRESS; // Replace with your deployed contract's address

  const VotingDapp = await ethers.getContractFactory("VotingDapp");
  const votingDapp = await VotingDapp.attach(votingDappAddress);

  const poll = await votingDapp.polls(pollId);

  // Check if candidates mapping exists in the poll
  if (!poll.candidates) {
    console.error("Candidates mapping not found in the poll!");
    return [];
  }

  return Object.keys(poll.candidates);
}




async function vote(pollId, candidateName) {
  const votingDappAddress = process.env.CONTRACT_ADDRESS; // Replace with your deployed contract's address

  const VotingDapp = await ethers.getContractFactory("VotingDapp");
  const votingDapp = await VotingDapp.attach(votingDappAddress);

  // Check if poll is active before voting
  const poll = await votingDapp.polls(pollId);
  if (!poll.isActive) {
    console.error("Poll is not active!");
    return;
  }

  // Retrieve candidates for the poll
  const validCandidates = await getCandidates(pollId);

  // Validate candidate name
  if (!validCandidates.includes(candidateName)) {
    console.error("Invalid candidate name!");
    return;
  }

  // Cast the vote
  const tx = await votingDapp.vote(pollId, candidateName);

  console.log(`Transaction hash: ${tx.hash}`);
  await tx.wait();

  console.log("Vote cast successfully!");
}

const pollId = 0; // Replace with the actual poll ID
const candidateName = "Candidate2"; // Replace with the actual candidate name

vote(pollId, candidateName);
