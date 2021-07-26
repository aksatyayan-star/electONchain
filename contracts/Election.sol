pragma solidity >=0.5.16;

contract Election {

    //smoke test 

    //store candidate
    //read candidate
    // string public candidate; //declare state variable
    //by declaring this var public we get getter function free by solidity and so we can use it in the terminal(truffle console) for smoke test.
    //Constructor
    // so constructor gonna run whenevr we deploy our smart contract on the blockchain network and so keep it public
    //constructor() public {
        //candidate is a state variable...going to be accessible inside our contract and going to represent data that belongs to our entire contract
        //candidate = "Candidate 1";

    //Model a candidate
    struct Candidate {
        // just declaring this struct wont actually give us candiadte..we would have to instantiate this struct and assign it to a variable before we can stick it in storage
        uint id;
        string name;
        uint voteCount;
    }
    //Store Candidates
    //Fetch Candidates
    mapping(uint => Candidate) public candidates;
    //like an associative array or a hash where we associate key value pairs with one another
    //like here the key will be unsigned integer and this will correspond to candidates id and the value will be a candidate structure type
    // like we saw in smoke test we can declare this mapping public and solidity will generate a getter (candidates) function for us that will allow us to fetch our candidates from this mapping
    // a note that whenever we add a candidate to this mapping we are changing the state of our contract and writing to the blockchain

    mapping(address => bool) public voters;
    // store accounts that have voted
    // so if we add the account address as key and set its value bool to true then we can say that this particular account has voted
    // the account address not added as a key value in the mapping will have its bool value by default false

    //Store candidate count
    //i.e how many candidates we have created
    uint public candidatesCount;
    //in solidity theres no way to determine the size of this mapping and thers also no way to iterate over it either as even for the key we have not assigned value it will return default value here blank candidate
    // so we are using this uint var to count ..i.e we will increament it by one whenever will add a candiadte and by this we can track the total no of candidates

    event votedEvent (
        uint indexed _candidateId
    );
    // voted event to get rid of that laodind screen when a vote has been casted and see the vote casted in real time
    // so we will trigger this event any time a vote is casted

    constructor() public {
        // as we want our smart contract to handle the addition of candiadtes..so calling this function inside default constructor so that this function will get run whenever our contract is migrated and deployed
        addCandidate("Achintya");
        addCandidate("Kumar");
        addCandidate("Satyayan");
    }
    // function to add candidate
    function addCandidate (string memory _name) private {

        // name as an argument in the function is a local var not state var so wee intialized it with an underscore
        // we made this function private so that it cant be accessible to public interface as then anyone can aad candidates to the election which will not be fair
        // we want our smart contract to handle this

        candidatesCount ++; // to keep track of total no of candidates 
        // as initially it should be 0 now 1 and so we can also use it as 1st candiadtes id as it will also be 1
        // hence we are passing it in the mapping candidates as key 
        // we assigned value to that key as a new candidate(we instantiated a candidate of structure tye) with initially total vote count 0
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote (uint _candidateId) public {
        // we want this to be a publicly visible function so that everyone connected to the blockchain network can give their vote
        // but we dont want this function be called whenever by whoever..we will have to add some conditions

        require(!voters[msg.sender]);
        //1st condn definitely that the account address must not have voted before
        // require that voter havent voted before....
        // so in require func..it accepts some condn and if that condn evaluates to true(i.e we ned condn which gives output as bool value) then the rest of the below code will get executed else execution stopped for further codes
        // so for the first time when an address tries to vote it gets added to mapping voters... so we will check that the address is not in our voters mapping in the condn in require function
        // so we checking that by passing voters[msg.sender] which will return true if the adress is present in the mapping else return false...so we need false and then we use ! to make it true so that the further code gets exceuted as our condn satisfied

        require(_candidateId > 0 && _candidateId <= candidatesCount);
        //2nd condn check that we are voting for a valid candidate
        // so this require function will evaluate to true only when both the condn is satisfied...and we can guarantee then that its a valid candiadte for sure
        msg.sender; // this will fetch us that account who voted 
        //now in solidity when we are sending candidateid as the argument we are also sending some meta data and in that meta data there is the account no who had casted the vote or called the function

        voters[msg.sender] = true;
        // record that voter has voted...ie we are getting the account info who has votted and then passing it has key to voters mapping and settng its value to true so that we can identify and keep track that this particular account has voted and not allowed to vote again
        candidates[_candidateId].voteCount ++;
        // update candidate vote count...so what we are doing is that we are calling the mapping function candidates and indexing it with the candidateid we get as an argument in the function vote and then we fetch votecount from struct candidate for that particular candidateid and increase the vote count

        //triggered event when vote is casted
        emit votedEvent(_candidateId);
    }
    }