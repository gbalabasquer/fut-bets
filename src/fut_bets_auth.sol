pragma solidity ^0.4.8;

import "ds-roles/role_auth.sol";

contract FUTBetsRoleAuth is DSRoleAuth {
    // role identifiers
    uint8 public admin  = 0;
    uint8 public writer = 1;

    function FUTBetsRoleAuth() {
        // The coin itself will be the authority
        setAuthority(this);
        
        // == admin
        setRoleCapability(admin, this, sig("addMatch(uint12,uint12,string,string,uint)"), true);
        setRoleCapability(admin, this, sig("setMatchResult(uint,uint12)"), true);
        
        // == issuer
        setRoleCapability(writer, this, sig("setMatchResult(uint,uint12)"), true);
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

    function addWriter(address who) auth {
        setUserRole(who, writer, true);
    }

    function delAdmin(address who) auth {
        setUserRole(who, admin, false);
    }

    function delWriter(address who) auth {
        setUserRole(who, writer, false);
    }

    function isAdmin(address who) constant returns (bool) {
        return hasUserRole(who, admin);
    }

    function isWriter(address who) constant returns (bool) {
        return hasUserRole(who, writer);
    }
}
