pragma solidity ^0.4.8;

import "ds-roles/role_auth.sol";

contract FUTBetsRoleAuth is DSRoleAuth {
    // role identifiers
    uint8 public admin  = 0;

    function FUTBetsRoleAuth() {
        // The coin itself will be the authority
        setAuthority(this);
        
        // == admin
        setRoleCapability(admin, this, sig("addMatch(string,string,uint)"), true);
        setRoleCapability(admin, this, sig("setMatchResult(uint,MatchResult)"), true);
        setRoleCapability(admin, this, sig("transferToken(address,uint)"), true);
    }

    function sig(string name) constant returns (bytes4) {
        return bytes4(sha3(name));
    }

    function setOwner(address newOwner) auth {
        addAdmin(newOwner);
        super.setOwner(newOwner);
    }

    function addAdmin(address who) auth {
        setUserRole(who, admin, true);
    }

    function delAdmin(address who) auth {
        setUserRole(who, admin, false);
    }

    function isAdmin(address who) constant returns (bool) {
        return hasUserRole(who, admin);
    }
}
