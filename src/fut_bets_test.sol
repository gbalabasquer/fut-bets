pragma solidity ^0.4.5;

import "dapple/test.sol";
import "fut_bets.sol";

contract FUTBetsTest is Test, Definitions {
    uint         constant TOWEI = 10**18;
    FUTToken     token;
    FUTBets      betsContract;
    uint         matchId;
    uint         betId;
    uint         betId2;
    uint         betId3;
    uint         betId4;
    uint         betId5;
    string       local;
    string       visitor;
    uint         time;
    FakePerson   admin;
    FakePerson   writer;
    FakePerson   user1;
    FakePerson   user2;
    FakePerson   user3;
    FakePerson   user4;
    FakePerson   user5;

    function setUp() {
        token = new FUTToken(1000000 * TOWEI);
        betsContract = new FUTBets(token);

        admin = new FakePerson();
        writer = new FakePerson();
        user1 = new FakePerson();
        user2 = new FakePerson();
        user3 = new FakePerson();
        user4 = new FakePerson();
        user5 = new FakePerson();

        // Transferring tokens to the users
        token.transfer(user1, 20000 * TOWEI);
        token.transfer(user2, 20000 * TOWEI);
        token.transfer(user3, 20000 * TOWEI);
        token.transfer(user4, 20000 * TOWEI);
        token.transfer(user5, 20000 * TOWEI);

        // Setting FUTToken as target for the users
        user1._target(token);
        user2._target(token);
        user3._target(token);
        user4._target(token);
        user5._target(token);
        // Allowing FUTBets contract to transfer on behalf the users
        FUTToken(user1).approve(betsContract, uint(-1));
        FUTToken(user2).approve(betsContract, uint(-1));
        FUTToken(user3).approve(betsContract, uint(-1));
        FUTToken(user4).approve(betsContract, uint(-1));
        FUTToken(user5).approve(betsContract, uint(-1));

        // Setting FUTBets as target for the users
        admin._target(betsContract);
        writer._target(betsContract);
        user1._target(betsContract);
        user2._target(betsContract);
        user3._target(betsContract);
        user4._target(betsContract);
        user5._target(betsContract);

        local = "Velez";
        visitor = "River";
        time = now + 10000;

        // Adding match
        matchId = betsContract.addMatch(local, visitor, now + 10000);

        // Adding first bet
        betId = FUTBets(user1).addBet(matchId, MatchResult.Local, 10000 * TOWEI);
    }

    function setBets() {
        betId2 = FUTBets(user2).addBet(matchId, MatchResult.Visitor, 5000 * TOWEI);
        betId3 = FUTBets(user3).addBet(matchId, MatchResult.Tie, 7500 * TOWEI);
        betId4 = FUTBets(user4).addBet(matchId, MatchResult.Local, 2500 * TOWEI);
        betId5 = FUTBets(user5).addBet(matchId, MatchResult.Tie, 1000 * TOWEI);
    }

    function testEnum() {
        var enNotSet = uint(MatchResult.NotSet);
        var enLocal = uint(MatchResult.Local);
        var enVisitor = uint(MatchResult.Visitor);
        var enTie = uint(MatchResult.Tie);

        assertEq(enNotSet, 0);
        assertEq(enLocal, 1);
        assertEq(enVisitor, 2);
        assertEq(enTie, 3);
    }

    function testGetMatch() {
        var (localB, visitorB, timeB, result) = betsContract.getMatch(matchId);

        //assertEq(localB, local);
        //assertEq(visitorB, visitor);
        assertEq(timeB, time);
        assertEq(uint(result), uint(MatchResult.NotSet));
    }

    function testGetBet() {
        var (owner, result, amount, paid) = betsContract.getBet(matchId, betId);

        assertEq(owner, user1);
        assertEq(uint(result), uint(MatchResult.Local));
        assertEq(amount, 10000 * TOWEI);
        assertEq(paid, false);
    }

    function testBetsAmount() {
        setBets();

        var (localAmount, visitorAmount, tieAmount) = betsContract.getMatchBetsAmount(matchId);

        assertEq(localAmount, 12500 * TOWEI);
        assertEq(visitorAmount, 5000 * TOWEI);
        assertEq(tieAmount, 8500 * TOWEI);
    }

    function testClaimPrize() {
        setBets();

        uint balance = token.balanceOf(user1);
        assertEq(balance, 10000 * TOWEI);

        betsContract.setMatchResult(matchId, MatchResult.Local);
        betsContract.claimPayment(matchId, betId);

        balance = token.balanceOf(user1);
        assertEq(balance, (10000 + (10000/12500) * 26000 ) * TOWEI);
    }

    function testFailNotEnoughToken() {
        betId = FUTBets(user1).addBet(matchId, MatchResult.Local, 10001 * TOWEI);
    }

    function testFailMatchExpired() {
        uint matchId2 = betsContract.addMatch(local, visitor, now - 1);
        FUTBets(user1).addBet(matchId2, MatchResult.Local, 100 * TOWEI);
    }

    function testFailClaimNoResult() {
        FUTBets(user1).claimPayment(matchId, betId);
    }
}


contract FakePerson is Tester, Definitions {
    function approve(address who, uint howMuch) returns (bool) {
        return FUTToken(_t).approve(who, howMuch);
    }

    function addBet(uint matchId, MatchResult result, uint amount) returns (uint) {
        return FUTBets(_t).addBet(matchId, result, amount);
    }
}
