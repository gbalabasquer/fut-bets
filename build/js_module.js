'use strict';

// For geth
if (typeof dapple === 'undefined') {
  var dapple = {};
}

if (typeof web3 === 'undefined' && typeof Web3 === 'undefined') {
  var Web3 = require('web3');
}

dapple['fut-bets'] = (function builder () {
  var environments = {
      'develop': {}
    };

  function ContractWrapper (headers, _web3) {
    if (!_web3) {
      throw new Error('Must supply a Web3 connection!');
    }

    this.headers = headers;
    this._class = _web3.eth.contract(headers.interface);
  }

  ContractWrapper.prototype.deploy = function () {
    var args = new Array(arguments);
    args[args.length - 1].data = this.headers.bytecode;
    return this._class.new.apply(this._class, args);
  };

  var passthroughs = ['at', 'new'];
  for (var i = 0; i < passthroughs.length; i += 1) {
    ContractWrapper.prototype[passthroughs[i]] = (function (passthrough) {
      return function () {
        return this._class[passthrough].apply(this._class, arguments);
      };
    })(passthroughs[i]);
  }

  function constructor (_web3, env) {
    if (!env) {
      env = {
      'objects': {},
      'type': 'internal'
    };
    }
    if(typeof env === "object" && !("objects" in env)) {
      env = {objects: env};
    }
    while (typeof env !== 'object') {
      if (!(env in environments)) {
        throw new Error('Cannot resolve environment name: ' + env);
      }
      env = {objects: environments[env]};
    }

    if (typeof _web3 === 'undefined') {
      if (!env.rpcURL) {
        throw new Error('Need either a Web3 instance or an RPC URL!');
      }
      _web3 = new Web3(new Web3.providers.HttpProvider(env.rpcURL));
    }

    this.headers = {
      'Callback': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'addr',
                'type': 'address'
              },
              {
                'name': 'eventName',
                'type': 'string'
              },
              {
                'name': 'functioncall',
                'type': 'string'
              }
            ],
            'name': 'on',
            'outputs': [],
            'payable': false,
            'type': 'function'
          }
        ],
        'bytecode': '606060405234610000575b610124806100196000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680636985e72414603c575b6000565b3460005760f0600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505060f2565b005b5b5050505600a165627a7a723058207b0aa0819e349b625b69850f05538ef341340e9bdbbdfaf4e9101c731adb516d0029'
      },
      'DappleEnv': {
        'interface': [
          {
            'inputs': [],
            'payable': false,
            'type': 'constructor'
          }
        ],
        'bytecode': '6060604052346000575b5b5b60358060186000396000f30060606040525b60005600a165627a7a7230582070f478a00b9745ded2b042f7b30d971bc34250da607c08a0d3b93e1a6190ec470029'
      },
      'DappleLogger': {
        'interface': [],
        'bytecode': '6060604052346000575b60358060166000396000f30060606040525b60005600a165627a7a7230582051135b7fd4ffcb6c6290a14ae9f35bab2705a9ba0fc58b88b6152ba10156410d0029'
      },
      'FUTBets': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'matchId',
                'type': 'uint256'
              },
              {
                'name': 'result',
                'type': 'uint256'
              },
              {
                'name': 'amount',
                'type': 'uint256'
              }
            ],
            'name': 'addBet',
            'outputs': [
              {
                'name': 'id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'getUserRoles',
            'outputs': [
              {
                'name': '',
                'type': 'bytes32'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'TIE',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'newOwner',
                'type': 'address'
              }
            ],
            'name': 'setOwner',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'isAdmin',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'code',
                'type': 'address'
              },
              {
                'name': 'sig',
                'type': 'bytes4'
              }
            ],
            'name': 'getCapabilityRoles',
            'outputs': [
              {
                'name': '',
                'type': 'bytes32'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'isWriter',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'code',
                'type': 'address'
              },
              {
                'name': 'sig',
                'type': 'bytes4'
              }
            ],
            'name': 'isCapabilityPublic',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'matchId',
                'type': 'uint256'
              },
              {
                'name': 'betId',
                'type': 'uint256'
              }
            ],
            'name': 'claimPayment',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'writer',
            'outputs': [
              {
                'name': '',
                'type': 'uint8'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'name': 'matches',
            'outputs': [
              {
                'name': 'week',
                'type': 'uint256'
              },
              {
                'name': 'year',
                'type': 'uint256'
              },
              {
                'name': 'local',
                'type': 'string'
              },
              {
                'name': 'visitor',
                'type': 'string'
              },
              {
                'name': 'time',
                'type': 'uint256'
              },
              {
                'name': 'result',
                'type': 'uint256'
              },
              {
                'name': 'next',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'name',
                'type': 'string'
              }
            ],
            'name': 'sig',
            'outputs': [
              {
                'name': '',
                'type': 'bytes4'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'next',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'delAdmin',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'VISITOR',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              },
              {
                'name': 'role',
                'type': 'uint8'
              },
              {
                'name': 'enabled',
                'type': 'bool'
              }
            ],
            'name': 'setUserRole',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'matchId',
                'type': 'uint256'
              }
            ],
            'name': 'getMatchDetail',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              },
              {
                'name': '',
                'type': 'uint256'
              },
              {
                'name': '',
                'type': 'uint256'
              },
              {
                'name': '',
                'type': 'uint256'
              },
              {
                'name': '',
                'type': 'uint256'
              },
              {
                'name': '',
                'type': 'uint256'
              },
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'addAdmin',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'newAuthority',
                'type': 'address'
              }
            ],
            'name': 'setAuthority',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'role',
                'type': 'uint8'
              },
              {
                'name': 'code',
                'type': 'address'
              },
              {
                'name': 'sig',
                'type': 'bytes4'
              },
              {
                'name': 'enabled',
                'type': 'bool'
              }
            ],
            'name': 'setRoleCapability',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'LOCAL',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'input',
                'type': 'bytes32'
              }
            ],
            'name': 'BITNOT',
            'outputs': [
              {
                'name': 'output',
                'type': 'bytes32'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              },
              {
                'name': 'role',
                'type': 'uint8'
              }
            ],
            'name': 'hasUserRole',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'caller',
                'type': 'address'
              },
              {
                'name': 'code',
                'type': 'address'
              },
              {
                'name': 'sig',
                'type': 'bytes4'
              }
            ],
            'name': 'canCall',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'authority',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'code',
                'type': 'address'
              },
              {
                'name': 'sig',
                'type': 'bytes4'
              },
              {
                'name': 'enabled',
                'type': 'bool'
              }
            ],
            'name': 'setPublicCapability',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'week',
                'type': 'uint256'
              },
              {
                'name': 'year',
                'type': 'uint256'
              },
              {
                'name': 'local',
                'type': 'string'
              },
              {
                'name': 'visitor',
                'type': 'string'
              },
              {
                'name': 'time',
                'type': 'uint256'
              }
            ],
            'name': 'addMatch',
            'outputs': [
              {
                'name': 'id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'delWriter',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              },
              {
                'name': 'enabled',
                'type': 'bool'
              }
            ],
            'name': 'setRootUser',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'addWriter',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint256'
              },
              {
                'name': 'result',
                'type': 'uint256'
              }
            ],
            'name': 'setMatchResult',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'admin',
            'outputs': [
              {
                'name': '',
                'type': 'uint8'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'isUserRoot',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'token',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': 't',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'constructor'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'week',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'year',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'local',
                'type': 'string'
              },
              {
                'indexed': false,
                'name': 'visitor',
                'type': 'string'
              },
              {
                'indexed': false,
                'name': 'time',
                'type': 'uint256'
              }
            ],
            'name': 'LogMatch',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint256'
              },
              {
                'indexed': true,
                'name': 'matchId',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'result',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'amount',
                'type': 'uint256'
              }
            ],
            'name': 'LogBet',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'matchId',
                'type': 'uint256'
              },
              {
                'indexed': true,
                'name': 'betId',
                'type': 'uint256'
              }
            ],
            'name': 'LogClaim',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'owner',
                'type': 'address'
              }
            ],
            'name': 'DSOwnerUpdate',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'authority',
                'type': 'address'
              }
            ],
            'name': 'DSAuthorityUpdate',
            'type': 'event'
          }
        ],
        'bytecode': '60606040526000600660006101000a81548160ff021916908360ff1602179055506001600660016101000a81548160ff021916908360ff160217905550600160085534620000005760405160208062003269833981016040528080519060200190919050505b5b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f4adb0d054d6e87bfe1386b27cc28f79f9f9df98b2bccd56891acda56b342f92960405180905060405180910390a25b62000130306200033264010000000002620019b2176401000000009004565b620001dc600660009054906101000a900460ff1630620001c0606060405190810160405280602a81526020017f6164644d617463682875696e7431322c75696e7431322c737472696e672c737481526020017f72696e672c75696e7429000000000000000000000000000000000000000000008152506200040b64010000000002620016c1176401000000009004565b6001620004786401000000000262001a73176401000000009004565b62000262600660009054906101000a900460ff163062000246604060405190810160405280601b81526020017f7365744d61746368526573756c742875696e742c75696e7431322900000000008152506200040b64010000000002620016c1176401000000009004565b6001620004786401000000000262001a73176401000000009004565b620002e8600660019054906101000a900460ff1630620002cc604060405190810160405280601b81526020017f7365744d61746368526573756c742875696e742c75696e7431322900000000008152506200040b64010000000002620016c1176401000000009004565b6001620004786401000000000262001a73176401000000009004565b5b80600660026101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b506200090b565b62000350620006ac64010000000002620025c8176401000000009004565b15156200035d5762000000565b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f35cedca97da6b22f40f8f660aab44c185bb73a3df4c5bd4d909bf83da04d19a560405180905060405180910390a25b5b50565b6000816040518082805190602001908083835b602083106200044357805182526020820191506020810190506020830392506200041e565b6001836020036101000a038019825116818451168082178552505050505050905001915050604051809103902090505b919050565b600060006200049a620006ac64010000000002620025c8176401000000009004565b1515620004a75762000000565b600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000857bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000205491508560ff1660020a60010290508215620005ea57808217600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000867bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000208160001916905550620006a2565b6200060981620008db6401000000000262001ca2176401000000009004565b8216600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000867bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002081600019169055505b5b5b505050505050565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156200070f5760019050620008d8565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156200075b5760009050620008d8565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b700961333306000357fffffffff00000000000000000000000000000000000000000000000000000000166000604051602001526040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019350505050602060405180830381600087803b15620000005760325a03f1156200000057505050604051805190509050620008d8565b5b5b90565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600102821890505b919050565b61294e806200091b6000396000f300606060405236156101b5576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063067073d6146101ba57806306a36aee146101fd57806309df06b71461024c57806313af40351461026f57806324d7806c146102a257806327538e90146102ed5780632b29ba23146103645780632f47571f146103af57806334b8fd9714610422578063453a2abc146104485780634768d4ef146104715780634b808215146105d05780634c8fe5261461067957806362d918551461069c5780636300bfc2146106cf57806367aff484146106f25780636b9e128d1461073c57806370480275146107975780637a9e5e4b146107ca5780637d40583d146107fd5780638da5cb5b1461086f5780639344e617146108be57806393aa5ca8146108e1578063a078f7371461091e578063b700961314610975578063bf7e214f14610a07578063c6b0263e14610a56578063d230688e14610abc578063d242bd1e14610b85578063d381ba7c14610bb8578063da2824a814610bf6578063db17685014610c29578063f851a44014610c4f578063fbf8077314610c78578063fc0c546a14610cc3575b610000565b34610000576101e76004808035906020019091908035906020019091908035906020019091905050610d12565b6040518082815260200191505060405180910390f35b346100005761022e600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061108e565b60405180826000191660001916815260200191505060405180910390f35b34610000576102596110d8565b6040518082815260200191505060405180910390f35b34610000576102a0600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506110dd565b005b34610000576102d3600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611107565b604051808215151515815260200191505060405180910390f35b3461000057610346600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690602001909190505061112a565b60405180826000191660001916815260200191505060405180910390f35b3461000057610395600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506111c4565b604051808215151515815260200191505060405180910390f35b3461000057610408600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19169060200190919050506111e7565b604051808215151515815260200191505060405180910390f35b3461000057610446600480803590602001909190803590602001909190505061128e565b005b346100005761045561166e565b604051808260ff1660ff16815260200191505060405180910390f35b346100005761048c6004808035906020019091905050611681565b6040518088815260200187815260200180602001806020018681526020018581526020018481526020018381038352888181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156105375780601f1061050c57610100808354040283529160200191610537565b820191906000526020600020905b81548152906001019060200180831161051a57829003601f168201915b50508381038252878181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156105ba5780601f1061058f576101008083540402835291602001916105ba565b820191906000526020600020905b81548152906001019060200180831161059d57829003601f168201915b5050995050505050505050505060405180910390f35b3461000057610625600480803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919050506116c1565b60405180827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b346100005761068661172c565b6040518082815260200191505060405180910390f35b34610000576106cd600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611732565b005b34610000576106dc611765565b6040518082815260200191505060405180910390f35b346100005761073a600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803560ff16906020019091908035151590602001909190505061176a565b005b34610000576107576004808035906020019091905050611880565b6040518088815260200187815260200186815260200185815260200184815260200183815260200182815260200197505050505050505060405180910390f35b34610000576107c8600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061197f565b005b34610000576107fb600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506119b2565b005b346100005761086d600480803560ff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff169060200190919080357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19169060200190919080351515906020019091905050611a73565b005b346100005761087c611c77565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34610000576108cb611c9d565b6040518082815260200191505060405180910390f35b3461000057610900600480803560001916906020019091905050611ca2565b60405180826000191660001916815260200191505060405180910390f35b346100005761095b600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803560ff16906020019091905050611cd2565b604051808215151515815260200191505060405180910390f35b34610000576109ed600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff169060200190919080357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916906020019091905050611d0c565b604051808215151515815260200191505060405180910390f35b3461000057610a14611ef5565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3461000057610aba600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19169060200190919080351515906020019091905050611f1b565b005b3461000057610b6f600480803590602001909190803590602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091908035906020019091905050611fdb565b6040518082815260200191505060405180910390f35b3461000057610bb6600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506123d7565b005b3461000057610bf4600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035151590602001909190505061240a565b005b3461000057610c27600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061247a565b005b3461000057610c4d60048080359060200190919080359060200190919050506124ad565b005b3461000057610c5c6124ea565b604051808260ff1660ff16815260200191505060405180910390f35b3461000057610ca9600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506124fd565b604051808215151515815260200191505060405180910390f35b3461000057610cd0612554565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6000610d1d8361257a565b4260076000868152602001908152602001600020600401541015610d4057610000565b600660029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd3330856000604051602001526040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b156100005760325a03f11561000057505050604051805190505060076000858152602001908152602001600020600701549050610e7660008214156125a7565b600160076000868152602001908152602001600020600701540160076000868152602001908152602001600020600701819055503360076000868152602001908152602001600020600601600083815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600760008681526020019081526020016000206006016000838152602001908152602001600020600201819055508160076000868152602001908152602001600020600601600083815260200190815260200160002060010181905550600060076000868152602001908152602001600020600601600083815260200190815260200160002060030160006101000a81548160ff021916908315150217905550610fed610fe860076000878152602001908152602001600020600801600086815260200190815260200160002054846125b7565b6125a7565b8160076000868152602001908152602001600020600801600085815260200190815260200160002054016007600086815260200190815260200160002060080160008581526020019081526020016000208190555083817f04f8ca06c193c8e730effd8489f11b5cfb4d208b442e1d4098cd6a389a9882188585604051808381526020018281526020019250505060405180910390a38090505b9392505050565b6000600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490505b919050565b600381565b6110e56125c8565b15156110f057610000565b6110f98161197f565b611102816127f0565b5b5b50565b600061112282600660009054906101000a900460ff16611cd2565b90505b919050565b6000600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000205490505b92915050565b60006111df82600660019054906101000a900460ff16611cd2565b90505b919050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060009054906101000a900460ff1690505b92915050565b60006000600060006000600060076000898152602001908152602001600020600601600088815260200190815260200160002060020154600760008a81526020019081526020016000206005015414158061131d575060076000898152602001908152602001600020600601600088815260200190815260200160002060030160009054906101000a900460ff165b1561132757610000565b6007600089815260200190815260200160002060080160006001815260200190815260200160002054955060076000898152602001908152602001600020600801600060028152602001908152602001600020549450600760008981526020019081526020016000206008016000600381526020019081526020016000205493506007600089815260200190815260200160002060060160008881526020019081526020016000206001015492506113e86113e38787876128b1565b6125a7565b83858701019150600090506001600760008a815260200190815260200160002060050154141561142257858381156100005704905061147e565b6002600760008a815260200190815260200160002060050154141561145157848381156100005704905061147d565b6003600760008a815260200190815260200160002060050154141561147c5783838115610000570490505b5b5b61149061148b82846128f9565b6125a7565b81810290506001600760008a8152602001908152602001600020600601600089815260200190815260200160002060030160006101000a81548160ff021916908315150217905550600660029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd30600760008c815260200190815260200160002060060160008b815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16846000604051602001526040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b156100005760325a03f11561000057505050604051805190505086887f6977e4a16da59a0d51e4f21eda926077d6dfaaddcf09926e4ff6cb22657dcd7f60405180905060405180910390a35b5050505050505050565b600660019054906101000a900460ff1681565b6007602052806000526040600020600091509050806000015490806001015490806002019080600301908060040154908060050154908060070154905087565b6000816040518082805190602001908083835b602083106116f757805182526020820191506020810190506020830392506116d4565b6001836020036101000a038019825116818451168082178552505050505050905001915050604051809103902090505b919050565b60085481565b61173a6125c8565b151561174557610000565b61176081600660009054906101000a900460ff16600061176a565b5b5b50565b600281565b600060006117766125c8565b151561178157610000565b600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205491508360ff1660020a6001029050821561182457808217600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208160001916905550611877565b61182d81611ca2565b8216600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081600019169055505b5b5b5050505050565b60006000600060006000600060006007600089815260200190815260200160002060000154600760008a815260200190815260200160002060010154600760008b815260200190815260200160002060040154600760008c815260200190815260200160002060050154600760008d815260200190815260200160002060080160006001815260200190815260200160002054600760008e815260200190815260200160002060080160006002815260200190815260200160002054600760008f81526020019081526020016000206008016000600381526020019081526020016000205496509650965096509650965096505b919395979092949650565b6119876125c8565b151561199257610000565b6119ad81600660009054906101000a900460ff16600161176a565b5b5b50565b6119ba6125c8565b15156119c557610000565b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f35cedca97da6b22f40f8f660aab44c185bb73a3df4c5bd4d909bf83da04d19a560405180905060405180910390a25b5b50565b60006000611a7f6125c8565b1515611a8a57610000565b600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000857bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000205491508560ff1660020a60010290508215611bcb57808217600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000867bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000208160001916905550611c6d565b611bd481611ca2565b8216600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000867bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002081600019169055505b5b5b505050505050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600181565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600102821890505b919050565b600060006000611ce18561108e565b91508360ff1660020a600102905080821660001916600060010260001916141592505b505092915050565b6000600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1680611dfe5750600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060009054906101000a900460ff165b15611e0c5760019050611eee565b600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002054600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541660001916600060010260001916141590505b9392505050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b611f236125c8565b1515611f2e57610000565b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000847bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060006101000a81548160ff0219169083151502179055505b5b505050565b6000611fe56125c8565b1515611ff057610000565b600854905061200260008214156125a7565b60016008540160088190555085600760008381526020019081526020016000206000018190555084600760008381526020019081526020016000206001018190555083600760008381526020019081526020016000206002019080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106120a457805160ff19168380011785556120d2565b828001600101855582156120d2579182015b828111156120d15782518255916020019190600101906120b6565b5b5090506120f791905b808211156120f35760008160009055506001016120db565b5090565b505082600760008381526020019081526020016000206003019080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061215957805160ff1916838001178555612187565b82800160010185558215612187579182015b8281111561218657825182559160200191906001019061216b565b5b5090506121ac91905b808211156121a8576000816000905550600101612190565b5090565b50506000600760008381526020019081526020016000206005018190555081600760008381526020019081526020016000206004018190555060016007600083815260200190815260200160002060070181905550600060076000838152602001908152602001600020600801600060018152602001908152602001600020819055506000600760008381526020019081526020016000206008016000600281526020019081526020016000208190555060006007600083815260200190815260200160002060080160006003815260200190815260200160002081905550807f943b595d628782ede26217700d97841be567093789981e674e84dd5d5617da3d8787878787604051808681526020018581526020018060200180602001848152602001838103835286818151815260200191508051906020019080838360008314612317575b805182526020831115612317576020820191506020810190506020830392506122f3565b505050905090810190601f1680156123435780820380516001836020036101000a031916815260200191505b5083810382528581815181526020019150805190602001908083836000831461238b575b80518252602083111561238b57602082019150602081019050602083039250612367565b505050905090810190601f1680156123b75780820380516001836020036101000a031916815260200191505b5097505050505050505060405180910390a28090505b5b95945050505050565b6123df6125c8565b15156123ea57610000565b61240581600660019054906101000a900460ff16600061176a565b5b5b50565b6124126125c8565b151561241d57610000565b80600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055505b5b5050565b6124826125c8565b151561248d57610000565b6124a881600660019054906101000a900460ff16600161176a565b5b5b50565b6124b56125c8565b15156124c057610000565b6124c98161257a565b8060076000848152602001908152602001600020600501819055505b5b5050565b600660009054906101000a900460ff1681565b6000600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1690505b919050565b600660029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6001811415801561258c575060028114155b8015612599575060038114155b156125a357610000565b5b50565b8015156125b357610000565b5b50565b600082828401101590505b92915050565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561262957600190506127ed565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141561267357600090506127ed565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b700961333306000357fffffffff00000000000000000000000000000000000000000000000000000000166000604051602001526040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019350505050602060405180830381600087803b156100005760325a03f115610000575050506040518051905090506127ed565b5b5b90565b6127f86125c8565b151561280357610000565b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f4adb0d054d6e87bfe1386b27cc28f79f9f9df98b2bccd56891acda56b342f92960405180905060405180910390a25b5b50565b600060006128bf85856125b7565b15156128ce57600091506128f1565b83850190506128dd81846125b7565b15156128ec57600091506128f1565b600191505b509392505050565b6000600082840290506000841480612918575082848281156100005704145b91505b50929150505600a165627a7a7230582063652dd9db12fceeac237a1ad99498c3b712beda8ee488e6523957294c30a6360029'
      },
      'FUTBetsEvents': {
        'interface': [
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'week',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'year',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'local',
                'type': 'string'
              },
              {
                'indexed': false,
                'name': 'visitor',
                'type': 'string'
              },
              {
                'indexed': false,
                'name': 'time',
                'type': 'uint256'
              }
            ],
            'name': 'LogMatch',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint256'
              },
              {
                'indexed': true,
                'name': 'matchId',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'result',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'amount',
                'type': 'uint256'
              }
            ],
            'name': 'LogBet',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'matchId',
                'type': 'uint256'
              },
              {
                'indexed': true,
                'name': 'betId',
                'type': 'uint256'
              }
            ],
            'name': 'LogClaim',
            'type': 'event'
          }
        ],
        'bytecode': '6060604052346000575b60358060166000396000f30060606040525b60005600a165627a7a723058208aae3916e1ae6319202793fcde8c7c330e904476baafe66fa3f5710ba66e4fcf0029'
      },
      'FUTBetsRoleAuth': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'getUserRoles',
            'outputs': [
              {
                'name': '',
                'type': 'bytes32'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'newOwner',
                'type': 'address'
              }
            ],
            'name': 'setOwner',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'isAdmin',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'code',
                'type': 'address'
              },
              {
                'name': 'sig',
                'type': 'bytes4'
              }
            ],
            'name': 'getCapabilityRoles',
            'outputs': [
              {
                'name': '',
                'type': 'bytes32'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'isWriter',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'code',
                'type': 'address'
              },
              {
                'name': 'sig',
                'type': 'bytes4'
              }
            ],
            'name': 'isCapabilityPublic',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'writer',
            'outputs': [
              {
                'name': '',
                'type': 'uint8'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'name',
                'type': 'string'
              }
            ],
            'name': 'sig',
            'outputs': [
              {
                'name': '',
                'type': 'bytes4'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'delAdmin',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              },
              {
                'name': 'role',
                'type': 'uint8'
              },
              {
                'name': 'enabled',
                'type': 'bool'
              }
            ],
            'name': 'setUserRole',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'addAdmin',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'newAuthority',
                'type': 'address'
              }
            ],
            'name': 'setAuthority',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'role',
                'type': 'uint8'
              },
              {
                'name': 'code',
                'type': 'address'
              },
              {
                'name': 'sig',
                'type': 'bytes4'
              },
              {
                'name': 'enabled',
                'type': 'bool'
              }
            ],
            'name': 'setRoleCapability',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'input',
                'type': 'bytes32'
              }
            ],
            'name': 'BITNOT',
            'outputs': [
              {
                'name': 'output',
                'type': 'bytes32'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              },
              {
                'name': 'role',
                'type': 'uint8'
              }
            ],
            'name': 'hasUserRole',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'caller',
                'type': 'address'
              },
              {
                'name': 'code',
                'type': 'address'
              },
              {
                'name': 'sig',
                'type': 'bytes4'
              }
            ],
            'name': 'canCall',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'authority',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'code',
                'type': 'address'
              },
              {
                'name': 'sig',
                'type': 'bytes4'
              },
              {
                'name': 'enabled',
                'type': 'bool'
              }
            ],
            'name': 'setPublicCapability',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'delWriter',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              },
              {
                'name': 'enabled',
                'type': 'bool'
              }
            ],
            'name': 'setRootUser',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'addWriter',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'admin',
            'outputs': [
              {
                'name': '',
                'type': 'uint8'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'isUserRoot',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'inputs': [],
            'payable': false,
            'type': 'constructor'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'owner',
                'type': 'address'
              }
            ],
            'name': 'DSOwnerUpdate',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'authority',
                'type': 'address'
              }
            ],
            'name': 'DSAuthorityUpdate',
            'type': 'event'
          }
        ],
        'bytecode': '60606040526000600660006101000a81548160ff021916908360ff1602179055506001600660016101000a81548160ff021916908360ff1602179055503462000000575b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f4adb0d054d6e87bfe1386b27cc28f79f9f9df98b2bccd56891acda56b342f92960405180905060405180910390a25b6200010d30620002cc6401000000000262000ca1176401000000009004565b620001b9600660009054906101000a900460ff16306200019d606060405190810160405280602a81526020017f6164644d617463682875696e7431322c75696e7431322c737472696e672c737481526020017f72696e672c75696e742900000000000000000000000000000000000000000000815250620003a56401000000000262000aba176401000000009004565b6001620004126401000000000262000d62176401000000009004565b6200023f600660009054906101000a900460ff163062000223604060405190810160405280601b81526020017f7365744d61746368526573756c742875696e742c75696e743132290000000000815250620003a56401000000000262000aba176401000000009004565b6001620004126401000000000262000d62176401000000009004565b620002c5600660019054906101000a900460ff1630620002a9604060405190810160405280601b81526020017f7365744d61746368526573756c742875696e742c75696e743132290000000000815250620003a56401000000000262000aba176401000000009004565b6001620004126401000000000262000d62176401000000009004565b5b620008a5565b620002ea620006466401000000000262001405176401000000009004565b1515620002f75762000000565b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f35cedca97da6b22f40f8f660aab44c185bb73a3df4c5bd4d909bf83da04d19a560405180905060405180910390a25b5b50565b6000816040518082805190602001908083835b60208310620003dd5780518252602082019150602081019050602083039250620003b8565b6001836020036101000a038019825116818451168082178552505050505050905001915050604051809103902090505b919050565b6000600062000434620006466401000000000262001405176401000000009004565b1515620004415762000000565b600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000857bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000205491508560ff1660020a600102905082156200058457808217600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000867bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002081600019169055506200063c565b620005a381620008756401000000000262000f8c176401000000009004565b8216600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000867bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002081600019169055505b5b5b505050505050565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415620006a9576001905062000872565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415620006f5576000905062000872565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b700961333306000357fffffffff00000000000000000000000000000000000000000000000000000000166000604051602001526040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019350505050602060405180830381600087803b15620000005760325a03f115620000005750505060405180519050905062000872565b5b5b90565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600102821890505b919050565b61171a80620008b56000396000f3006060604052361561013c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306a36aee1461014157806313af40351461019057806324d7806c146101c357806327538e901461020e5780632b29ba23146102855780632f47571f146102d0578063453a2abc146103435780634b8082151461036c57806362d918551461041557806367aff4841461044857806370480275146104925780637a9e5e4b146104c55780637d40583d146104f85780638da5cb5b1461056a57806393aa5ca8146105b9578063a078f737146105f6578063b70096131461064d578063bf7e214f146106df578063c6b0263e1461072e578063d242bd1e14610794578063d381ba7c146107c7578063da2824a814610805578063f851a44014610838578063fbf8077314610861575b610000565b3461000057610172600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506108ac565b60405180826000191660001916815260200191505060405180910390f35b34610000576101c1600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506108f6565b005b34610000576101f4600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610920565b604051808215151515815260200191505060405180910390f35b3461000057610267600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916906020019091905050610943565b60405180826000191660001916815260200191505060405180910390f35b34610000576102b6600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506109dd565b604051808215151515815260200191505060405180910390f35b3461000057610329600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916906020019091905050610a00565b604051808215151515815260200191505060405180910390f35b3461000057610350610aa7565b604051808260ff1660ff16815260200191505060405180910390f35b34610000576103c1600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610aba565b60405180827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b3461000057610446600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610b25565b005b3461000057610490600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803560ff169060200190919080351515906020019091905050610b58565b005b34610000576104c3600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610c6e565b005b34610000576104f6600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610ca1565b005b3461000057610568600480803560ff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff169060200190919080357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19169060200190919080351515906020019091905050610d62565b005b3461000057610577610f66565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34610000576105d8600480803560001916906020019091905050610f8c565b60405180826000191660001916815260200191505060405180910390f35b3461000057610633600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803560ff16906020019091905050610fbc565b604051808215151515815260200191505060405180910390f35b34610000576106c5600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff169060200190919080357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916906020019091905050610ff6565b604051808215151515815260200191505060405180910390f35b34610000576106ec6111df565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3461000057610792600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19169060200190919080351515906020019091905050611205565b005b34610000576107c5600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506112c5565b005b3461000057610803600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803515159060200190919050506112f8565b005b3461000057610836600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611368565b005b346100005761084561139b565b604051808260ff1660ff16815260200191505060405180910390f35b3461000057610892600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506113ae565b604051808215151515815260200191505060405180910390f35b6000600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490505b919050565b6108fe611405565b151561090957610000565b61091281610c6e565b61091b8161162d565b5b5b50565b600061093b82600660009054906101000a900460ff16610fbc565b90505b919050565b6000600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000205490505b92915050565b60006109f882600660019054906101000a900460ff16610fbc565b90505b919050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060009054906101000a900460ff1690505b92915050565b600660019054906101000a900460ff1681565b6000816040518082805190602001908083835b60208310610af05780518252602082019150602081019050602083039250610acd565b6001836020036101000a038019825116818451168082178552505050505050905001915050604051809103902090505b919050565b610b2d611405565b1515610b3857610000565b610b5381600660009054906101000a900460ff166000610b58565b5b5b50565b60006000610b64611405565b1515610b6f57610000565b600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205491508360ff1660020a60010290508215610c1257808217600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208160001916905550610c65565b610c1b81610f8c565b8216600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081600019169055505b5b5b5050505050565b610c76611405565b1515610c8157610000565b610c9c81600660009054906101000a900460ff166001610b58565b5b5b50565b610ca9611405565b1515610cb457610000565b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f35cedca97da6b22f40f8f660aab44c185bb73a3df4c5bd4d909bf83da04d19a560405180905060405180910390a25b5b50565b60006000610d6e611405565b1515610d7957610000565b600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000857bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000205491508560ff1660020a60010290508215610eba57808217600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000867bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000208160001916905550610f5c565b610ec381610f8c565b8216600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000867bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002081600019169055505b5b5b505050505050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600102821890505b919050565b600060006000610fcb856108ac565b91508360ff1660020a600102905080821660001916600060010260001916141592505b505092915050565b6000600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16806110e85750600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060009054906101000a900460ff165b156110f657600190506111d8565b600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002054600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541660001916600060010260001916141590505b9392505050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b61120d611405565b151561121857610000565b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000847bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060006101000a81548160ff0219169083151502179055505b5b505050565b6112cd611405565b15156112d857610000565b6112f381600660019054906101000a900460ff166000610b58565b5b5b50565b611300611405565b151561130b57610000565b80600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055505b5b5050565b611370611405565b151561137b57610000565b61139681600660019054906101000a900460ff166001610b58565b5b5b50565b600660009054906101000a900460ff1681565b6000600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1690505b919050565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415611466576001905061162a565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156114b0576000905061162a565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b700961333306000357fffffffff00000000000000000000000000000000000000000000000000000000166000604051602001526040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019350505050602060405180830381600087803b156100005760325a03f1156100005750505060405180519050905061162a565b5b5b90565b611635611405565b151561164057610000565b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f4adb0d054d6e87bfe1386b27cc28f79f9f9df98b2bccd56891acda56b342f92960405180905060405180910390a25b5b505600a165627a7a723058206966e217df3acd4b96bf141b3f095fc8f9c453ba2e3885ac9995c68f6e744b6d0029'
      },
      'SMS': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'number',
                'type': 'string'
              },
              {
                'name': 'message',
                'type': 'string'
              }
            ],
            'name': 'send',
            'outputs': [],
            'payable': false,
            'type': 'function'
          }
        ],
        'bytecode': '606060405234610000575b610104806100196000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063bd6de11c14603c575b6000565b3460005760d1600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505060d3565b005b5b50505600a165627a7a723058206db943171c071fdd4d8f4a514a5a131e3e37505b6f47ab9c79aacb46fc7940970029'
      },
      'Script': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'name': 'addr',
                'type': 'address'
              }
            ],
            'name': 'export',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'txoff',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'txon',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'inputs': [],
            'payable': false,
            'type': 'constructor'
          },
          {
            'payable': false,
            'type': 'fallback'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'number',
                'type': 'uint256'
              }
            ],
            'name': 'exportNumber',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'addr',
                'type': 'address'
              }
            ],
            'name': 'exportObject',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'flag',
                'type': 'bool'
              }
            ],
            'name': 'setCalls',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'origin',
                'type': 'address'
              }
            ],
            'name': 'setOrigin',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'chaintype',
                'type': 'bytes32'
              }
            ],
            'name': 'assertChain',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'env',
                'type': 'bytes32'
              }
            ],
            'name': 'pushEnv',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'env',
                'type': 'bytes32'
              }
            ],
            'name': 'popEnv',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'addr',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': 'eventName',
                'type': 'string'
              },
              {
                'indexed': false,
                'name': 'functioncall',
                'type': 'string'
              }
            ],
            'name': 'on',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'input',
                'type': 'bytes'
              },
              {
                'indexed': false,
                'name': 'result',
                'type': 'uint256'
              }
            ],
            'name': 'shUint',
            'type': 'event'
          }
        ],
        'bytecode': '606060405234610000575b5b5b727202eeaad2c871c74c094231d1a4d28028321b600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073127202eeaad2c871c74c094231d1a4d28028321b600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b6101e3806100c66000396000f30060606040523615610055576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680635067a4bd146100635780639fc288d1146100a3578063d900596c146100b2575b34610000576100615b5b565b005b34610000576100a160048080356000191690602001909190803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506100c1565b005b34610000576100b0610139565b005b34610000576100bf610178565b005b7fdeb8643b9b3399f6925a9b6f1f780d90946f75267aaab1d59685d28dd846b9c382826040518083600019166000191681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a15b5050565b7fe68392b8656cb7ab571c539efc7ce5a43464478a591f773a55db9984c089f4d16001604051808215151515815260200191505060405180910390a15b565b7fe68392b8656cb7ab571c539efc7ce5a43464478a591f773a55db9984c089f4d16000604051808215151515815260200191505060405180910390a15b5600a165627a7a72305820bc9c5023a25f403eeb860e45371a659abbf5ef769e3a885918357c0176efdd680029'
      },
      'System': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'input',
                'type': 'string'
              }
            ],
            'name': 'to_uint',
            'outputs': [
              {
                'name': 'output',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          }
        ],
        'bytecode': '606060405234610000575b60dc806100186000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360cfa96314603c575b6000565b34600057608e600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505060a4565b6040518082815260200191505060405180910390f35b6000600b90505b9190505600a165627a7a723058205527de3009acc0a0c369781aa58ecad7c706ec19817bdd7e8eea7fb0cc49dca10029'
      }
    };

    this.classes = {};
    for (var key in this.headers) {
      this.classes[key] = new ContractWrapper(this.headers[key], _web3);
    }

    this.objects = {};
    for (var i in env.objects) {
      var obj = env.objects[i];
      if(!(obj['type'].split('[')[0] in this.classes)) continue;
      this.objects[i] = this.classes[obj['type'].split('[')[0]].at(obj.value);
    }
  }

  return {
    class: constructor,
    environments: environments
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = dapple['fut-bets'];
}
