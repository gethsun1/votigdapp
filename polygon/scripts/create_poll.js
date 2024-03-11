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
    const candidateImages = ["QmWyYouwMk3T5NJkweiYYcqKhAs1qbZdC3fCx2WRJFHujw", "QmQezp2vYHyDXiVsdbfpJ5APbYRQ4hSib2HDi9NZhpRis1", "QmV2sXnjHTxvj8Zx9vA3FS1APNXkmg5Gx8Epj3WU1fANJS", "QmPAA2mqmmUqvbvqoisseSr9TXa8vpPmztxGTVbLe3NYcu"];
    const partyNames = ["PartyA", "PartyB", "PartyC", "PartyD"];
    const partySymbols = ["QmenoA2URRRAmTVL4T9s7dMexETcJxH8dWbAntfHbJ24C6", "QmcQiWu1rPEgM3m3d8x77jisfvuUGcDoTBkGGAzph9ut8J", "QmSuJxaMWDnGucN4jxZQih86Dxhoz8q9SWMP1MsiraDyzm", "QmWHufdWuF8QtYu2AddEMYuS7T8ixR47bULa7W79bMLFnv"];

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
