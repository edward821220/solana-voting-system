/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/voting_system.json`.
 */
export type VotingSystem = {
  "address": "FDgFxeYS7Bw1NCx38qwg6xnR8ELicuGKGHcT6aDwUDBX",
  "metadata": {
    "name": "votingSystem",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createVote",
      "discriminator": [
        173,
        115,
        165,
        78,
        226,
        132,
        205,
        254
      ],
      "accounts": [
        {
          "name": "voteManager",
          "writable": true
        },
        {
          "name": "vote",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  111,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "vote_manager.total_votes",
                "account": "voteManager"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "topic",
          "type": "string"
        },
        {
          "name": "options",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "endTime",
          "type": "i64"
        }
      ]
    },
    {
      "name": "executeVote",
      "discriminator": [
        64,
        153,
        132,
        176,
        32,
        144,
        189,
        0
      ],
      "accounts": [
        {
          "name": "vote",
          "writable": true
        },
        {
          "name": "userVote",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "vote"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initVoteManager",
      "discriminator": [
        76,
        252,
        2,
        9,
        31,
        102,
        59,
        2
      ],
      "accounts": [
        {
          "name": "voteManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  111,
                  116,
                  101,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "userVote",
      "discriminator": [
        136,
        163,
        243,
        202,
        202,
        124,
        112,
        53
      ]
    },
    {
      "name": "vote",
      "discriminator": [
        96,
        91,
        104,
        57,
        145,
        35,
        172,
        155
      ]
    },
    {
      "name": "voteManager",
      "discriminator": [
        40,
        153,
        184,
        32,
        45,
        29,
        255,
        219
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "alreadyVoted",
      "msg": "Already voted!"
    },
    {
      "code": 6001,
      "name": "voteEnded",
      "msg": "Vote ended!"
    }
  ],
  "types": [
    {
      "name": "userVote",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "vote",
            "type": "pubkey"
          },
          {
            "name": "hasVoted",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "vote",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "topic",
            "type": "string"
          },
          {
            "name": "options",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "votes",
            "type": {
              "vec": "u32"
            }
          },
          {
            "name": "endTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "voteManager",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalVotes",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "seed",
      "type": "string",
      "value": "\"anchor\""
    }
  ]
};
