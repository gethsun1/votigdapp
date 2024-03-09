const { ethers } = require("hardhat");
require("dotenv").config();

async function createPoll() {
  const votingDappAddress = process.env.CONTRACT_ADDRESS;

  if (!votingDappAddress) {
    console.error("Contract address not provided. Please set CONTRACT_ADDRESS in your environment variables.");
    return;
  }

  try {
    const VotingDapp = await ethers.getContractFactory("VotingDapp");
    const votingDapp = await VotingDapp.attach(votingDappAddress);

    const pollTitle = "Elections for President";
    const pollDescription = "Vote for Your Favorite Candidate!";
    const pollDuration = 60 * 60 * 24 * 7; // 7 days in seconds

    // Candidate details
    const candidateNames = ["Candidate1", "Candidate2", "Candidate3", "Candidate4"];
    const candidateImages = ["ipfs://image1", "ipfs://image2", "ipfs://image3", "ipfs://image4"];
    const partyNames = ["PartyA", "PartyB", "PartyC", "PartyD"];
    const partySymbols = ["SymbolA", "SymbolB", "SymbolC", "SymbolD"];

    // Update positions array to have only one position - "President"
    

    const tx = await votingDapp.createPoll(
      pollTitle,
      pollDescription,
      pollDuration,
      candidateNames,
      candidateImages,
      partyNames,
      partySymbols,
    );

    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();

    console.log("Poll created successfully!");
  } catch (error) {
    console.error("Error creating poll:", error);
  }
}

createPoll();
