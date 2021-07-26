// we number all our files in migration directory so truffle knows the order to run them
// to deploy our smart contarct to a local blockchain network
var Election = artifacts.require("./Election.sol");

// artifacts reperent the contract abstraction that is specific to truffle and this will give us an election artifact that represents our samrt contract
// and truffle will expose this so that we can interact with it in any case we want to..so in console when we write test or when we use it in our front end app

module.exports = function(deployer) {
  deployer.deploy(Election);
};

//we have added a directive to deploy our contract with this function


//copied the code the same from by default 1_initialmigratioon file and changed variables to election