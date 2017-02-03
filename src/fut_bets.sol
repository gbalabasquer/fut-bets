pragma solidity ^0.4.8;

import "fut-token/fut_token.sol";
import 'ds-base/base.sol';
import "fut_bets_auth.sol";

contract Definitions {
    enum    MatchResult { NotSet, Local, Visitor, Tie }
}

contract FUTBetsEvents is Definitions {
    event LogMatch(uint indexed id, string local, string visitor, uint time);
    event LogBet(uint indexed id, uint indexed matchId, MatchResult result, uint amount);
    event LogClaim(uint indexed matchId, uint indexed betId);
}

contract FUTBets is FUTBetsRoleAuth, DSBase, FUTBetsEvents
{
    address                      public                  token;
    mapping( uint => Match )     public                  matches;
    uint                         public                  next = 1;

    struct Match {
        string                      local;
        string                      visitor;
        uint                        time;
        MatchResult                 result;
        mapping( uint => Bet )      bets;
        uint                        next;
        mapping( uint8 => uint )     amount;
    }

    struct Bet {
        address     owner;
        uint        amount;
        MatchResult result;
        bool        paid;     
    }

    function FUTBets(address t) {
        token = t;
    }

    function addMatch(string local, string visitor, uint time)
    auth
    returns (uint id)
    {
        id = next;
        assert(id != 0);

        next = next + 1;

        matches[id].local = local;
        matches[id].visitor = visitor;
        matches[id].result = MatchResult.NotSet;
        matches[id].time = time;
        matches[id].next = 1;
        matches[id].amount[uint8(MatchResult.Local)] = 0;
        matches[id].amount[uint8(MatchResult.Visitor)] = 0;
        matches[id].amount[uint8(MatchResult.Tie)] = 0;

        LogMatch(id, local, visitor, time);

        return id;
    }

    function setMatchResult(uint id, MatchResult result)
    auth
    {
        validResult(result);

        matches[id].result = result;
    }

    function addBet(uint matchId, MatchResult result, uint amount)
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

        assert(safeToAdd(matches[matchId].amount[uint8(result)], amount));
        matches[matchId].amount[uint8(result)] = matches[matchId].amount[uint8(result)] + amount;

        LogBet(id, matchId, result, amount);

        return id;
    }

    function claimPayment(uint matchId, uint betId) {
        // Checking if bet was one of the winners and the bet was not already paid
        if (matches[matchId].result != matches[matchId].bets[betId].result ||
            matches[matchId].bets[betId].paid) {
            throw;
        }

        var localAmount = matches[matchId].amount[uint8(MatchResult.Local)];
        var visitorAmount = matches[matchId].amount[uint8(MatchResult.Visitor)];
        var tieAmount = matches[matchId].amount[uint8(MatchResult.Tie)];
        uint betAmount = matches[matchId].bets[betId].amount;

        assert(safeToAddThree(localAmount, visitorAmount, tieAmount));
        uint totalAmount = localAmount + visitorAmount + tieAmount;

        // Calculating payment for the winner
        uint payAmount = 0;
        assert(safeToMul(betAmount, totalAmount));
        
        if (matches[matchId].result == MatchResult.Local) {
            payAmount = betAmount * totalAmount / localAmount;
        } else if (matches[matchId].result == MatchResult.Visitor) {
            payAmount = betAmount * totalAmount / visitorAmount;
        } else if (matches[matchId].result == MatchResult.Tie) {
            payAmount = betAmount * totalAmount / tieAmount;
        }
        //

        // Bet set as paid
        matches[matchId].bets[betId].paid = true;
        // Transfering tokens to winner user
        FUTToken(token).transfer(matches[matchId].bets[betId].owner, payAmount);

        LogClaim(matchId, betId);
    }

    function validResult (MatchResult result) internal {
        if (result != MatchResult.Local && result != MatchResult.Visitor && result != MatchResult.Tie) {
            throw;
        }
    }

    function getLastMatchId() returns (uint) {
        return next - 1;
    }

    function getMatch(uint matchId) returns (string, string, uint, MatchResult) {
        return (matches[matchId].local,
                matches[matchId].visitor,
                matches[matchId].time,
                matches[matchId].result
                );
    }

    function getMatchBetsAmount(uint matchId) returns (uint, uint, uint) {
        return (matches[matchId].amount[uint8(MatchResult.Local)],
                matches[matchId].amount[uint8(MatchResult.Visitor)],
                matches[matchId].amount[uint8(MatchResult.Tie)]
                );
    }

    function getLastBetId(uint matchId) returns (uint) {
        return matches[matchId].next - 1;
    }

    function getBet(uint matchId, uint betId) returns (address, MatchResult, uint, bool) {
        return (matches[matchId].bets[betId].owner,
                matches[matchId].bets[betId].result,
                matches[matchId].bets[betId].amount,
                matches[matchId].bets[betId].paid
                );
    }

    function transferToken(address t, uint quantity)
    auth
    {
        FUTToken(t).transfer(msg.sender, quantity);
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
