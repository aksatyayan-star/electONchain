//testing our smart contract
var Election = artifacts.require("./Election.sol");

// abstraction to interact with our contract

contract("Election", function(accounts) {

    // declare our contract
    // this is going to inject all the accounts that exist in our development environmrnt and we can use this account for testing purposes
    
    var electionInstance;

    it("initializes with three candidates", function() {
        return Election.deployed().then(function(instance) {
          return instance.candidatesCount();
        }).then(function(count) {
          assert.equal(count, 3);
        });
      });

    // 1st thing to test is that our contract was initialized with the correct no of candidates
    // these things we get from our mocha testing framework and the last line assertion we get from chai assertion framework
    // so 1st in the it- we provided a description that our contrsct was initialized with three candidates
    // in 2nd line we fetch an instance of our deployed contract like we used to do it in truffle console
    // in 3rd linee we get access to that instance in the callback function and once we have that we are going to fetch our candidates count 
    // and that call is also asynchronous so we need to execute a promise chain i.e for whole function(instance) and inject the value of count there
    // after that we use this assertion that the value is equal to 3
    // then just save this file till heere and run it in the terminal using command truffle test and if its shows passed then cool go ahead

    it("it initializes the candidates with the correct values", function() {
        return Election.deployed().then(function(instance) {
          electionInstance = instance;
          return electionInstance.candidates(1);
        }).then(function(candidate) {
          assert.equal(candidate[0], 1, "contains the correct id");
          assert.equal(candidate[1], "Achintya", "contains the correct name");
          assert.equal(candidate[2], 0, "contains the correct votes count");
          return electionInstance.candidates(2);
        }).then(function(candidate) {
          assert.equal(candidate[0], 2, "contains the correct id");
          assert.equal(candidate[1], "Kumar", "contains the correct name");
          assert.equal(candidate[2], 0, "contains the correct votes count");
          return electionInstance.candidates(3);
        }).then(function(candidate) {
          assert.equal(candidate[0], 3, "contains the correct id");
          assert.equal(candidate[1], "Satyayan", "contains the correct name");
          assert.equal(candidate[2], 0, "contains the correct votes count");
        });
      });
    // next thing to test is that our candidates were actually initialized wuth the correct values i.e the naame is correct, the vote count is correct, the id is correct
    // so again in 1st line in the it- we provide a description
    // in 2nd line again fetch an instance off our deployed contract but here in 3rd line we assigned it to a electionInstance variable as we want to access this instance within our promise chain and we cant do it like the way we did it for the above test
    // in 4th line using that instance we call our candidates mapping function where we stored the key value pairs of all the candidates and again the call is asynchronous so we use a promise chain with a callback function and pass the candidate in there
    // now ewe have the candidate so we will refernce its value by indexing and check for each values
    // so now again run the truffle test command in the terminal and you will get to see 2 test passing.. again the 1st one and then this one

    it("allows a voter to cast a vote", function() {
        return Election.deployed().then(function(instance) {
          electionInstance = instance;
          candidateId = 1;
          return electionInstance.vote(candidateId, { from: accounts[0] }); //so this from accounts[0] is the metadata that we dicussed we can provide in soilidity function arguments
        }).then(function(receipt) {
          assert.equal(receipt.logs.length, 1, "an event was triggered");
          assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
          assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
          return electionInstance.voters(accounts[0]);
        }).then(function(voted) {
          assert(voted, "the voter was marked as voted");
          return electionInstance.candidates(candidateId);
        }).then(function(candidate) {
          var voteCount = candidate[2];
          assert.equal(voteCount, 1, "increments the candidate's vote count");
        })
      });

      //here in this test we basically test two things firts that when a voter votes then the vote count for tat particular candidate gets increamented
      // 2nd that once a voter cast his or her vote then it gets added to the mapping that we created for voters

      it("throws an exception for invalid candiates", function() {
        return Election.deployed().then(function(instance) {
          electionInstance = instance;
          return electionInstance.vote(99, { from: accounts[1] })
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
          return electionInstance.candidates(1);
        }).then(function(candidate1) {
          var voteCount = candidate1[2];
          assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
          return electionInstance.candidates(2);
        }).then(function(candidate2) {
          var voteCount = candidate2[2];
          assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
          return electionInstance.candidates(3);
        }).then(function(candidate3) {
          var voteCount = candidate3[2];
          assert.equal(voteCount, 0, "candidate 3 did not receive any votes");
        });
      });
      // we will vote one time for an invalid candidate in line 4...then we can check for the error by calling assert_fail inside that promise chain in line5
      // and we will catch that error and inject it into that callback function - function(error)
      /// now once wre inside this callack funct we can inspect our error object..we will check the error msg and check that this error msg has this substring revert inside of it...
      // as we saw when we try to run the app vote event in the truffle console our error msg had the revert keyword in it...so by this way we can verify that the error we got is fine
      // thwn we will ensure that the state of our contract is unaltered whenevr this require func is  called
      // so this thing we do is fetch the 1st candidate and we want to ensure that its vote count didnt change and we check that it is equal to 1 as we had voted for once for this candiadte in test3 or in the test written above this test and for the rest we will male sure that the count is 0

      it("throws an exception for double voting", function() {
        return Election.deployed().then(function(instance) {
          electionInstance = instance;
          candidateId = 2;
          electionInstance.vote(candidateId, { from: accounts[1] });
          return electionInstance.candidates(candidateId);
        }).then(function(candidate) {
          var voteCount = candidate[2];
          assert.equal(voteCount, 1, "accepts first vote");
          // Try to vote again
          return electionInstance.vote(candidateId, { from: accounts[1] });
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
          return electionInstance.candidates(1);
        }).then(function(candidate1) {
          var voteCount = candidate1[2];
          assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
          return electionInstance.candidates(2);
        }).then(function(candidate2) {
          var voteCount = candidate2[2];
          assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
          return electionInstance.candidates(3);
        }).then(function(candidate3) {
          var voteCount = candidate3[2];
          assert.equal(voteCount, 0, "candidate 3 did not receive any votes");
        });
      });
      // now we will check that an account cant vote twice
      // so for testing we will take candiadteid 2 and we will vote once from account no 1 and we will read this candiadte out of the candidate mapping in line 7
      // and we will make sure that the 1st timw we voted for this candidate it worked that the vote count increamented to 1 and then we will try to vote again
      // then we check for the substring revert in error msg like we did in previous test and again after these all
      // we will ensure that the state of our contract is unchanged and we will do it like again as in the previous test...
      // now here we will check 1 vote for each candiadte 1 and 2 as for candiadte 1 we had voted once in test3 and for condiadte 2 we just voted now in this test
      // so only for candiadte 3 we will count votes as 0
})  