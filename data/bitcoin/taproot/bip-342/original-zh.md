BIP: 342
Layer: Consensus (soft fork)
Title: Validation of Taproot Scripts
Authors: Pieter Wuille
           Jonas Nick
           Anthony Towns
Status: Deployed
Type: Specification
Assigned: 2020-01-19
License: BSD-3-Clause
Requires: 340, 341

==Introduction==

===Abstract===

This document specifies the semantics of the initial scripting system under BIP341.

===Motivation===

BIP341 proposes improvements to just the script structure, but some of its goals are incompatible with the semantics of certain opcodes within the scripting language itself.

==Design==

* Signature opcodes `OP_CHECKSIG` and `OP_CHECKSIGVERIFY` are modified to verify Schnorr signatures as specified in BIP340.
* The inefficient `OP_CHECKMULTISIG` and `OP_CHECKMULTISIGVERIFY` opcodes are disabled.
* A new opcode `OP_CHECKSIGADD` is introduced to allow creating the same multisignature policies in a batch-verifiable way.
* Tapscript uses a new, simpler signature opcode limit.
* A potential malleability vector is eliminated by requiring MINIMALIF.

==Specification==

The rules below only apply when validating a taproot script path spend with leaf version 0xc0.

===Script execution===

* '''Disabled script opcodes''': `OP_CHECKMULTISIG` and `OP_CHECKMULTISIGVERIFY` are disabled.
* '''Consensus-enforced MINIMALIF''': The input argument to `OP_IF` and `OP_NOTIF` must be either exactly 0 or exactly 1.
* '''OP_SUCCESSx opcodes''': Some opcodes are renamed to `OP_SUCCESSx`, and make the script unconditionally valid (upgrade mechanism).
* '''Signature opcodes''': `OP_CHECKSIG` and `OP_CHECKSIGVERIFY` operate on Schnorr public keys and signatures.

===Resource limits===

* '''Script size limit''': The maximum script size of 10000 bytes does not apply. Size is only implicitly bounded by the block weight limit.
* '''Sigops limit''': The sigops in tapscripts do not count towards the block-wide limit. Instead, there is a per-script sigops budget.

==Deployment==

This proposal is deployed identically to Taproot (BIP341).

==Copyright==

This document is licensed under the 3-clause BSD license.