const { ethers } = require("hardhat");
require("dotenv").config();

async function queryPollDetails() {
  const votingDappAddress = process.env.CONTRACT_ADDRESS;

  if (!votingDappAddress) {
    console.error("Contract address not provided. Please set CONTRACT_ADDRESS in your environment variables.");
    return;
  }

  try {
    const VotingDapp = await ethers.getContractFactory("VotingDapp");
    const votingDapp = await VotingDapp.attach(votingDappAddress);

    // Get the total number of polls
    const pollsCount = await votingDapp.getPollsCount();
    console.log(`Total number of polls: ${pollsCount}`);

    for (let i = 1; i <= pollsCount; i++) {
      try {
        const [
          title,
          description,
          startTime,
          duration,
          candidateNames,
          candidateImages,
          partyNames,
          partySymbols,
        ] = await votingDapp.getPollDetails(i);
  
        console.log(`\nPoll ${i} Details:`);
        console.log(`Title: ${title}`);
        console.log(`Description: ${description}`);
        console.log(`Start Time: ${new Date(startTime * 1000).toLocaleString()}`);
        console.log(`Duration: ${duration} seconds`);
  
        console.log("\nCandidates:");
        for (let j = 0; j < candidateNames.length; j++) {
          console.log(`  ${j + 1}. ${candidateNames[j]} (${partyNames[j]} - ${partySymbols[j]})`);
        }
      } catch (error) {
        console.error(`Error retrieving details for Poll ${i}:`, error);
      }
    }
  } catch (error) {
    console.error("Error querying poll details:", error);
  }
}

queryPollDetails();
