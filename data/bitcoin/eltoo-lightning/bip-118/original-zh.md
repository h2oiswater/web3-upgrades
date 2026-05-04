BIP: 118
Layer: Consensus (soft fork)
Title: SIGHASH_ANYPREVOUT for Taproot Scripts
Authors: Christian Decker
           Anthony Towns
Status: Draft
Type: Specification
Assigned: 2017-02-28
License: BSD-3-Clause
Requires: 340, 341, 342

== Introduction ==

=== Abstract ===

This BIP describes a new type of public key for tapscript transactions. It allows signatures for these public keys to not commit to the exact UTXO being spent. This enables dynamic binding of transactions to different UTXOs, provided they have compatible scripts.

=== Motivation ===

Off-chain protocols make use of transactions that are not yet broadcast to the Bitcoin network in order to renegotiate the final state that should be settled on-chain. In a number of cases it is desirable to respond to a given transaction being seen on-chain with a predetermined reaction in the form of another transaction.

Often the same reaction is desired for a variety of different transactions that may be seen on-chain, but because the input signatures in the response transaction commit to the exact transaction that is being reacted to, this means a new signature must be created for every possible transaction one wishes to be able to react to.

This proposal introduces a new public key type that modifies the behavior of the transaction digest algorithm used in the signature creation and verification, by excluding the commitment to the previous output (and, optionally, the witness script and value). Removing this commitment allows dynamic rebinding of a signed transaction to another previous output that requires authorisation by the same key.

The dynamic rebinding is opt-in due to using a separate public key type, and the breadth of transactions the signature can be rebound to can be further restricted by using different keys, committing to the script being spent in the signature, using different amounts between UTXOs, using different nSequence values in the spending transaction, or using the codeseparator opcode to commit to the position in the script.

== Specification ==

This BIP modifies the behaviour of the BIP 342 signature opcodes for public keys that have a length of 33 bytes and a first byte of 0x01 or the public key which is precisely the single byte vector 0x01. These keys are termed BIP 118 public keys.

=== Signature message ===

We define SIGHASH_ANYPREVOUT = 0x40 and SIGHASH_ANYPREVOUTANYSCRIPT = 0xc0.

With SIGHASH_ANYPREVOUT, the digest is calculated as if SIGHASH_ANYONECANPAY was set, except outpoint is not included in the digest.

With SIGHASH_ANYPREVOUTANYSCRIPT, the digest is calculated as if SIGHASH_ANYONECANPAY was set, except outpoint, amount, scriptPubKey and tapleaf_hash are not included in the digest.

== Security ==

=== Signature replay ===

By design, SIGHASH_ANYPREVOUT and SIGHASH_ANYPREVOUTANYSCRIPT introduce additional potential for signature replay. With SIGHASH_ANYPREVOUT signature replay is possible for different UTXOs with the same scriptPubKey and the same value, while with SIGHASH_ANYPREVOUTANYSCRIPT signature replay is possible for any UTXOs that reuse the same BIP 118 public key in one of their potential scripts.

As a consequence, implementers MUST ensure that BIP 118 public keys are only reused when signature replay cannot cause loss of funds.

=== Malleability ===

Use of SIGHASH_ANYPREVOUT or SIGHASH_ANYPREVOUTANYSCRIPT may introduce additional malleability vectors. A transaction authenticated using only ANYPREVOUT signatures is malleable to anyone able to provide an alternate input satisfied by the signature.

== Deployment ==

This may be deployed as a soft-fork either concurrent with, or subsequent to the deployment of BIP 340, 341 and 342.

== Backwards compatibility ==

As a soft fork, older software will continue to operate without modification. Nodes that have not upgraded to support BIP 341 will see all taproot witness programs as anyone-can-spend scripts.

== Rationale ==

This proposal only supports ANYPREVOUT signatures via script path spends, and does not support ANYPREVOUT signatures for key path spends. This is for two reasons: first, not supporting key path spends allows this proposal to be independent of the core changes included in BIP 341 and BIP 342; second, it allows addresses to opt-in or opt-out of ANYPREVOUT support while remaining indistinguishable prior to being spent.

== Copyright ==

This document is licensed under the 3-clause BSD license.