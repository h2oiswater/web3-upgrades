BIP: 119
Layer: Consensus (soft fork)
Title: CHECKTEMPLATEVERIFY
Authors: Jeremy Rubin
Status: Draft
Type: Specification
Assigned: 2020-01-06
License: BSD-3-Clause

==Abstract==

This BIP proposes a new opcode, OP_CHECKTEMPLATEVERIFY, to be activated as a change to the semantics of OP_NOP4.

==Summary==

OP_CHECKTEMPLATEVERIFY uses opcode OP_NOP4 (0xb3) as a soft fork upgrade. It does the following:

* There is at least one element on the stack, fail otherwise
* The element on the stack is 32 bytes long, NOP otherwise
* The DefaultCheckTemplateVerifyHash of the transaction at the current input index is equal to the element on the stack, fail otherwise

The DefaultCheckTemplateVerifyHash commits to the serialized version, locktime, scriptSigs hash, number of inputs, sequences hash, number of outputs, outputs hash, and currently executing input index.

==Motivation==

This BIP introduces a transaction template, a simple spending restriction that pattern matches a transaction against a hashed transaction specification. OP_CHECKTEMPLATEVERIFY reduces many of the trust, interactivity, and storage requirements inherent with the use of pre-signing in applications.

Applications include:
* Congestion control for batching transactions
* Payment pools for scaling on-chain
* Vaults for cold storage security
* Trustless channels
* Batched channel creation
* DLC improvements
* Ark protocol support

==Specification==

The execution of the opcode requires:
1. At least one stack argument
2. A 32-byte argument to verify against the transaction template hash
3. If the hashes match, succeed; otherwise fail

The hash is computed over:
* nVersion (4 bytes)
* nLockTime (4 bytes)
* scriptSigs hash (if any non-null scriptSigs)
* number of inputs (uint32)
* sequences hash
* number of outputs (uint32)
* outputs hash
* current input index

==Deployment==

Activation logic is elided from this BIP. Until BIP-119 reaches ACTIVE state, node implementations should execute a NOP4 as SCRIPT_ERR_DISCOURAGE_UPGRADABLE_NOPS for policy and must evaluate as a NOP for consensus.

==Backwards Compatibility==

OP_CHECKTEMPLATEVERIFY replaces OP_NOP4 with stricter verification semantics. Scripts which previously were valid will cease to be valid with this change. Stricter verification semantics for an OP_NOP are a soft fork, so existing software will be fully functional without upgrade except for mining and block validation.

==Copyright==

This document is licensed under the 3-clause BSD license.