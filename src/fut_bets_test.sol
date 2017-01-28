pragma solidity ^0.4.5;

import "dapple/test.sol";
import "fut_bets.sol";

/*contract Vault {
    function approve(ERC20 token, address who, uint how_much) {
        token.approve(who, how_much);
    }
}*/

contract FUTBetsTest is Test {
    // Be explicit about units. Can force this by setting to prime
    // powers, but then percentage changes are difficult.
    FUTToken     token;
    FUTBets      betsContract;
    uint         matchId;
    uint         week;
    uint         year;
    string       local;
    string       visitor;
    uint         time;

    function setUp() {
        token = new FUTToken(1000*10^18);
        betsContract = new FUTBets(token);

        week = 5;
        year = 2017;
        local = 'Velez';
        visitor = 'River';
        time = now + 10000;

        matchId = betsContract.addMatch(5, 2017, 'Velez', 'River', now + 10000);
    }

    function testAddMatch() {
        var (weekB, yearB, timeB, result, amountLocal, amountVisitor, amountTie) = betsContract.getMatchDetail(matchId);

        assertEq(weekB, week);
        assertEq(yearB, year);
        // assertEq(localB, local);
        // assertEq(visitorB, visitor);
        assertEq(timeB, time);
        assertEq(result, 0);
        assertEq(amountLocal, 0);
        assertEq(amountVisitor, 0);
        assertEq(amountTie, 0);
    }
}

/*contract FakePerson is Tester {
    function register(ERC20 token) returns (uint48) {
        return Simplecoin(_t).register(token);
    }
}*/
