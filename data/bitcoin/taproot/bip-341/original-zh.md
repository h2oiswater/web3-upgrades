BIP: 341
Layer: Consensus (soft fork)
Title: Taproot: SegWit version 1 spending rules
Authors: Pieter Wuille
           Jonas Nick
           Anthony Towns
Status: Deployed
Type: Specification
Assigned: 2020-01-19
License: BSD-3-Clause
Requires: 340

==Introduction==

===Abstract===

This document proposes a new SegWit version 1 output type, with spending rules based on Taproot, Schnorr signatures, and Merkle branches.

===Motivation===

This proposal aims to improve privacy, efficiency, and flexibility of Bitcoin's scripting capabilities without adding new security assumptions. Specifically, it seeks to minimize how much information about the spendability conditions of a transaction output is revealed on chain at creation or spending time and to add a number of upgrade mechanisms, while fixing a few minor but long-standing issues.

==Design==

* '''Merkle branches''' let us only reveal the actually executed part of the script to the blockchain.
* '''Taproot''' merges the traditionally separate pay-to-pubkey and pay-to-scripthash policies, making all outputs spendable by either a key or (optionally) a script, and indistinguishable from each other.
* '''Schnorr signatures''' permit key aggregation: a public key can be constructed from multiple participant public keys, requiring cooperation between all participants to sign.
* '''Batch validation''' allows multiple signatures to be validated together more efficiently.

==Specification==

===Script validation rules===

A Taproot output is a native SegWit output with version number 1, and a 32-byte witness program.

Let q be the 32-byte array containing the witness program.

* If there is exactly one element left in the witness stack, key path spending is used.
* If there are at least two witness elements left, script path spending is used with Merkle branch verification.

===Signature validation rules===

A Taproot signature is a 64-byte Schnorr signature, as defined in BIP340, with the sighash byte appended.

== Constructing and spending Taproot outputs ==

Every Taproot output corresponds to a combination of a single public key condition (the internal key), and zero or more general conditions encoded in scripts organized in a tree.

== Security ==

Taproot improves the privacy of Bitcoin because instead of revealing all possible conditions for spending an output, only the satisfied spending condition has to be published.

== Deployment ==

This BIP is deployed concurrently with BIP342.

For Bitcoin mainnet, the deployment activated at height 709632.

== Backwards compatibility ==

As a soft fork, older software will continue to operate without modification. Non-upgraded nodes will consider all SegWit version 1 witness programs as anyone-can-spend scripts.

== Reference Implementation ==

https://github.com/bitcoin/bitcoin/pull/21365

== Copyright ==

This document is licensed under the 3-clause BSD license.