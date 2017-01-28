pragma solidity ^0.4.8;

import "fut-token/fut.sol";
import 'ds-base/base.sol';
import "fut_bets_auth.sol";

contract FUTBetsEvents {
    event LogMatch(uint indexed id, uint week, uint year, string local, string visitor, uint time);
    event LogBet(uint indexed id, uint indexed matchId, uint result, uint amount);
    event LogClaim(uint indexed matchId, uint indexed betId);
}

contract FUTBets is FUTBetsRoleAuth, DSBase, FUTBetsEvents
{
    uint                         public constant         LOCAL = 1;
    uint                         public constant         VISITOR = 2;
    uint                         public constant         TIE = 3;

    address                      public                  token;
    mapping( uint => Match )     public                  matches;
    uint                         public                  next = 1;

    struct Match {
        uint                        week;
        uint                        year;
        string                      local;
        string                      visitor;
        uint                        time;
        uint                        result;
        mapping( uint => Bet )      bets;
        uint                        next;
        mapping( uint => uint )     amount;
    }

    struct Bet {
        address     owner;
        uint        amount;
        uint        result;   
        bool        paid;     
    }

    function FUTBets(address t) {
        token = t;
    }

    function addMatch(uint week, uint year, string local, string visitor, uint time)
    auth
    returns (uint id)
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

        LogMatch(id, week, year, local, visitor, time);

        return id;
    }

    function setMatchResult(uint id, uint result)
    auth
    {
        validResult(result);

        matches[id].result = result;
    }

    function addBet(uint matchId, uint result, uint amount)
    returns (uint id)
    {
        validResult(result);

        // Check if the expiration time of the match
        if (matches[matchId].time < now) {
            throw;
        }

        // Transfer token from the user to the contract
        FUTToken(token).transferFrom(msg.sender, this, amount);

        // Get new bet Id
        id = matches[matchId].next;
        assert(id != 0);

        matches[matchId].next = matches[matchId].next + 1;

        matches[matchId].bets[id].owner = msg.sender;
        matches[matchId].bets[id].result = result;
        matches[matchId].bets[id].amount = amount;
        matches[matchId].bets[id].paid = false;

        assert(safeToAdd(matches[matchId].amount[result], amount));
        matches[matchId].amount[result] = matches[matchId].amount[result] + amount;

        LogBet(id, matchId, result, amount);

        return id;
    }

    function claimPayment(uint matchId, uint betId) {
        // Checking if bet was one of the winners and the bet was not already paid
        if (matches[matchId].result != matches[matchId].bets[betId].result ||
            matches[matchId].bets[betId].paid) {
            throw;
        }

        var local = matches[matchId].amount[LOCAL];
        var visitor = matches[matchId].amount[VISITOR];
        var tie = matches[matchId].amount[TIE];
        uint betAmount = matches[matchId].bets[betId].amount;

        assert(safeToAddThree(local, visitor, tie));
        uint total = local + visitor + tie;

        // Calculating payment for the winner
        uint payAmount = 0;
        if (matches[matchId].result == LOCAL) {
            payAmount = (betAmount / local);
        } else if (matches[matchId].result == VISITOR) {
            payAmount = (betAmount / visitor);
        } else if (matches[matchId].result == TIE) {
            payAmount = (betAmount / tie);
        }

        assert(safeToMul(payAmount, total));
        payAmount = payAmount * total;
        //

        // Bet set as paid
        matches[matchId].bets[betId].paid = true;
        // Transfering tokens to winner user
        FUTToken(token).transferFrom(this, matches[matchId].bets[betId].owner, payAmount);

        LogClaim(matchId, betId);
    }

    function validResult (uint result) internal {
        if (result != LOCAL && result != VISITOR && result != TIE) {
            throw;
        }
    }

    function getMatchDetail(uint matchId) returns (uint, uint, uint, uint, uint, uint, uint) {
        return (matches[matchId].week,
                matches[matchId].year,
                matches[matchId].time,
                matches[matchId].result,
                matches[matchId].amount[LOCAL],
                matches[matchId].amount[VISITOR],
                matches[matchId].amount[TIE]);
    }

    function safeToAddThree(uint a, uint b, uint c) internal returns (bool) {
        if (!safeToAdd(a, b)) {
            return false;
        }
        var t = a + b;
        if (!safeToAdd(t, c)) {
            return false;
        }
        return true;
    }
}