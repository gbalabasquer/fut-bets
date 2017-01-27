pragma solidity ^0.4.8;

import "fut-token/fut.sol";

contract FUTBetsEvents {
    event Match(uint indexed id, uint12 week, uint12 year, string local, string visitor, uint time);
    event Bet(uint indexed id, uint indexed matchId, uint12 result, uint amount);
    event Claim(uint indexed matchId, uint indexed betId);
}

contract FUTBets is FUTBetsEvents
{
    uint12                       public constant         LOCAL = 1;
    uint12                       public constant         VISITOR = 2;
    uint12                       public constant         TIE = 3;

    address                      public                  token;
    mapping( uint => match )     public                  matches;
    uint                         public                  next = 1;

    struct match {
        uint12                      week;
        uint12                      year;
        string                      local;
        string                      visitor;
        uint                        time;
        uint12                      result;
        mapping( uint => bet )      bets;
        uint                        next;
        mapping( uint12 => uint )   amount;
    }

    struct bet {
        address     owner;
        uint        amount;
        uint12      result;   
        bool        paid;     
    }

    function FUTBets(address t) {
        token = t;
    }

    function addMatch(uint12 week, uint12 year, string local, string visitor, uint time)
    //TODO: Add auth modifier
    {
        id = next;
        assert(id != 0);

        next = next + 1;

        matches[id].week = week;
        matches[id].year = year;
        matches[id].local = local;
        matches[id].visitor = visitor;
        matches[id].result = 0;
        matches[id].time = time;
        matches[id].next = 1;
        matches[id].amount[LOCAL] = 0;
        matches[id].amount[VISITOR] = 0;
        matches[id].amount[TIE] = 0;

        Match(id, week, year, local, visitor, time);
    }

    function setMatchResult(uint id, uint12 result)
    //TODO: Add auth modifier
    {
        validResult();

        matches[id].result = result;
    }

    function addBet(uint matchId, uint12 result, uint amount)
    {
        validResult();

        //TODO: check time match is not expired
        FUTToken(token).transferFrom(msg.sender, this, amount);

        id = matches[matchId].next;
        assert(id != 0);

        matches[matchId].next = matches[matchId].next + 1;

        matches[matchId].bets[id].owner = msg.sender;
        matches[matchId].bets[id].result = result;
        matches[matchId].bets[id].amount = amount;
        matches[matchId].bets[id].paid = false;
        //TODO: Add safeAdd
        matches[matchId].amount[result] = matches[matchId].amount[result] + amount;

        Bet(id, matchId, result, amount);
    }

    function claimPayment(uint matchId, uint betId) {
        if (matches[matchId].result != matches[matchId].bets[betId].result ||
            matches[matchId].bets[betId].paid) {
            throw;
        }

        var (local, visitor, tie) = getActualMatchStats(matchId);
        //TODO: Add safeAdd and safeMul
        uint betAmount = matches[matchId].bets[betId].amount;
        uint total = local + visitor + tie;
        uint payAmount = 0;

        if (matches[matchId].result == LOCAL) {
            payAmount = (betAmount / local) * total;
        } else if (matches[matchId].result == VISITOR) {
            payAmount = (betAmount / visitor) * total;
        } else if (matches[matchId].result == TIE) {
            payAmount = (betAmount / tie) * total;
        }

        matches[matchId].bets[betId].paid = true;
        FUTToken(token).transferFrom(this, matches[matchId].bets[betId].owner, payAmount);

        Claim(matchId, betId);
    }

    function validResult internal(uint result) {
        if (result != LOCAL && result != VISITOR && result != TIE) {
            throw;
        }
    }

    function getActualMatchStats(uint matchId) returns (uint local, uint visitor, uint tie) {
        return (matches[matchId].amount[LOCAL], matches[matchId].amount[VISITOR], matches[matchId].amount[TIE]);
    }
}