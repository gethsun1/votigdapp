 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingDapp {

    address public owner;
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Counter functionality
    uint256 private pollIdCounter;

    function _incrementPollId() internal {
        pollIdCounter++;
    }

    function _getCurrentPollId() internal view returns (uint256) {
        return pollIdCounter;
    }

    function getPollsCount() external view returns (uint256) {
        return pollIdCounter;
    }

    struct Candidate {
        string name;
        string image; // IPFS hash or URL to the image
        string partyName;
        string partySymbol;
    }

    struct Poll {
        uint256 id;
        string title;
        string description;
        uint256 startTime;
        uint256 duration;
        mapping(address => bool) voters;
        mapping(string => uint256) votes;
        mapping(string => Candidate) candidates;
        string[] candidateNames; 
        bool isActive;
    }

    // Array to store all polls
    mapping(uint256 => Poll) public polls;

    // Event to notify when a new poll is created
    event PollCreated(
        uint256 indexed id,
        string title,
        string description,
        uint256 duration,
        string[] candidateNames,
        string[] candidateImages,
        string[] partyNames,
        string[] partySymbols
    );

    // Modifier to check if a poll is active
    modifier onlyActivePoll(uint256 _pollId) {
        require(polls[_pollId].isActive, "Poll is not active");
        _;
    }

    function getCandidateNames(uint256 _pollId) external view returns (string[] memory) {
        require(_pollId <= pollIdCounter, "Poll does not exist");

        Poll storage poll = polls[_pollId];
        string[] memory candidateNames = new string[](poll.candidateNames.length);

        for (uint256 i = 0; i < poll.candidateNames.length; i++) {
            candidateNames[i] = poll.candidateNames[i];
        }

        return candidateNames;
    }

    // Function to create a new poll with multiple candidates
    function createPoll(
        string memory _title,
        string memory _description,
        uint256 _duration,
        string[] memory _candidateNames,
        string[] memory _candidateImages,
        string[] memory _partyNames,
        string[] memory _partySymbols
    ) external onlyOwner {
        require(_candidateNames.length > 0, "At least one candidate is required");

        uint256 pollId = _getCurrentPollId();
        _incrementPollId();

        polls[pollId].id = pollId;
        polls[pollId].title = _title;
        polls[pollId].description = _description;
        polls[pollId].startTime = block.timestamp;
        polls[pollId].duration = _duration;
        polls[pollId].isActive = true;

        // Initialize candidates mapping
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            polls[pollId].candidates[_candidateNames[i]] = Candidate({
                name: _candidateNames[i],
                image: _candidateImages[i],
                partyName: _partyNames[i],
                partySymbol: _partySymbols[i]
            });
            polls[pollId].candidateNames.push(_candidateNames[i]);  // Add candidate name to array
        }

        emit PollCreated(
            pollId,
            _title,
            _description,
            _duration,
            polls[pollId].candidateNames,
            _candidateImages, // Passing the array of candidate directly
            _partyNames,
            _partySymbols
        );
    }

    // Function to vote for a candidate in a poll
    function vote(uint256 _pollId, string memory _candidate) external onlyActivePoll(_pollId) {
        require(!polls[_pollId].voters[msg.sender], "You have already voted in this poll");
        require(bytes(_candidate).length > 0, "Invalid candidate");

        // Update vote counts for the selected candidate
        polls[_pollId].votes[_candidate]++;

        // Mark the address as having voted
        polls[_pollId].voters[msg.sender] = true;
    }

    // Function to get votes for a specific candidate in a poll
    function getVotesForCandidate(uint256 _pollId, string memory _candidate) external view returns (uint256) {
        require(_pollId <= pollIdCounter, "Poll does not exist");
        return polls[_pollId].votes[_candidate];
    }
  
 
 
    function getCandidateDetails(uint256 _pollId, string memory _candidateName) external view returns (string memory, string memory, string memory, string memory) {
            require(_pollId <= pollIdCounter, "Poll does not exist");

            Candidate storage candidate = polls[_pollId].candidates[_candidateName];

            return (
                candidate.name,
                candidate.image,
                candidate.partyName,
                candidate.partySymbol
            );
    }



        struct CandidateDetail {
        string name;
        string image;
        string partyName;
        string partySymbol;
    }

    function getPollDetails(uint256 _pollId) external view returns (
        string memory title,
        string memory description,
        uint256 startTime,
        uint256 duration,
        string[] memory candidateNames,
        string[] memory candidateImages,
        string[] memory partyNames,
        string[] memory partySymbols
    ) {
        require(_pollId <= pollIdCounter, "Poll does not exist");

        Poll storage poll = polls[_pollId];

        title = poll.title;
        description = poll.description;
        startTime = poll.startTime;
        duration = poll.duration;

        candidateNames = new string[](poll.candidateNames.length);
        candidateImages = new string[](poll.candidateNames.length);
        partyNames = new string[](poll.candidateNames.length);
        partySymbols = new string[](poll.candidateNames.length);

        for (uint256 i = 0; i < poll.candidateNames.length; i++) {
            string memory name = poll.candidateNames[i];
            Candidate storage candidate = poll.candidates[name];

            candidateNames[i] = name;
            candidateImages[i] = candidate.image;
            partyNames[i] = candidate.partyName;
            partySymbols[i] = candidate.partySymbol;
        }
    }


   

    function getCandidateImages(uint256 _pollId) internal view returns (string[] memory) {
        Poll storage poll = polls[_pollId];
        string[] memory candidateImages = new string[](poll.candidateNames.length);

        for (uint256 i = 0; i < poll.candidateNames.length; i++) {
            candidateImages[i] = poll.candidates[poll.candidateNames[i]].image;
        }

        return candidateImages;
    }

    function getCandidatePartyNames(uint256 _pollId) internal view returns (string[] memory) {
        Poll storage poll = polls[_pollId];
        string[] memory partyNames = new string[](poll.candidateNames.length);

        for (uint256 i = 0; i < poll.candidateNames.length; i++) {
            partyNames[i] = poll.candidates[poll.candidateNames[i]].partyName;
        }

        return partyNames;
    }

    function getCandidatePartySymbols(uint256 _pollId) internal view returns (string[] memory) {
        Poll storage poll = polls[_pollId];
        string[] memory partySymbols = new string[](poll.candidateNames.length);

        for (uint256 i = 0; i < poll.candidateNames.length; i++) {
            partySymbols[i] = poll.candidates[poll.candidateNames[i]].partySymbol;
        }

        return partySymbols;
    }
}