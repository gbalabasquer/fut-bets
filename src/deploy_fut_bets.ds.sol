pragma solidity ^0.4.8;

import "dapple/script.sol";
import "./fut_bets.sol";
import "fut-token/fut_token.sol";

contract DeployFUTBets is Script {
  function DeployFUTBets() {
    exportObject("futbets", new FUTBets(env.futtoken));
  }
}
