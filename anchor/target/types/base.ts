/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/base.json`.
 */
export type Base = {
  "address": "JAVuBXeBZqXNtS73azhBDAoYaaAFfo4gWXoZe2e7Jf8H",
  "metadata": {
    "name": "base",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "deletePost",
      "discriminator": [
        208,
        39,
        67,
        161,
        55,
        13,
        153,
        42
      ],
      "accounts": [
        {
          "name": "post",
          "writable": true
        },
        {
          "name": "author",
          "signer": true,
          "relations": [
            "post"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "sendPost",
      "discriminator": [
        132,
        245,
        238,
        29,
        243,
        42,
        173,
        54
      ],
      "accounts": [
        {
          "name": "post",
          "writable": true,
          "signer": true
        },
        {
          "name": "author",
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
          "name": "content",
          "type": "string"
        }
      ]
    },
    {
      "name": "updatePost",
      "discriminator": [
        151,
        128,
        207,
        107,
        169,
        246,
        241,
        107
      ],
      "accounts": [
        {
          "name": "post",
          "writable": true
        },
        {
          "name": "author",
          "signer": true,
          "relations": [
            "post"
          ]
        }
      ],
      "args": [
        {
          "name": "topic",
          "type": "string"
        },
        {
          "name": "content",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "post",
      "discriminator": [
        8,
        147,
        90,
        186,
        185,
        56,
        192,
        150
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "topicTooLong",
      "msg": "The provided caption should be 50 characters long maximum."
    },
    {
      "code": 6001,
      "name": "contentTooLong",
      "msg": "The provided content should be 50 characters long maximum."
    }
  ],
  "types": [
    {
      "name": "post",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "author",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "topic",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          }
        ]
      }
    }
  ]
};
