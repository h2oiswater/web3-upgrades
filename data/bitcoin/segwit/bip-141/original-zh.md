BIP: 141
Layer: Consensus (soft fork)
Title: Segregated Witness (Consensus layer)
Authors: Eric Lombrozo
           Johnson Lau
           Pieter Wuille
Status: Deployed
Type: Specification
Assigned: 2015-12-21
License: PD

==Abstract==

This BIP defines a new structure called a "witness" that is committed to blocks separately from the transaction merkle tree. This structure contains data required to check transaction validity but not required to determine transaction effects. In particular, scripts and signatures are moved into this new structure.

The witness is committed in a tree that is nested into the block's existing merkle root via the coinbase transaction for the purpose of making this BIP soft fork compatible. A future hard fork can place this tree in its own branch.

==Motivation==

The entirety of the transaction's effects are determined by output consumption (spends) and new output creation. Other transaction data, and signatures in particular, are only required to validate the blockchain state, not to determine it.

By removing this data from the transaction structure committed to the transaction merkle tree, several problems are fixed:

1. '''Nonintentional malleability becomes impossible'''. Since signature data is no longer part of the transaction hash, changes to how the transaction was signed are no longer relevant to transaction identification.
2. '''Transmission of signature data becomes optional'''. It is needed only if a peer is trying to validate a transaction instead of just checking its existence.
3. '''Some constraints could be bypassed with a soft fork''' by moving part of the transaction data to a structure unknown to current protocol.

==Specification==

=== Transaction ID ===

A new data structure, `witness`, is defined. Each transaction will have 2 IDs.

Definition of `txid` remains unchanged: the double SHA256 of the traditional serialization format.

A new `wtxid` is defined: the double SHA256 of the new serialization with witness data.

=== Commitment structure ===

A new block rule is added which requires a commitment to the `wtxid`. The `wtxid` of coinbase transaction is assumed to be `0x0000....0000`.

=== Witness program ===

A `scriptPubKey` that consists of a 1-byte push opcode followed by a direct data push between 2 and 40 bytes gets a new special meaning.

If the version byte is 0, and the witness program is 20 bytes: P2WPKH.
If the version byte is 0, and the witness program is 32 bytes: P2WSH.

=== Block size ===

Block weight is defined as Base size * 3 + Total size.
The new rule is block weight ≤ 4,000,000.

=== Sigops ===

Sigops in the current pubkey script, signature script, and P2SH check script are counted at 4 times their previous value.
The sigop limit is likewise quadrupled to ≤ 80,000.

== Backward compatibility ==

As a soft fork, older software will continue to operate without modification. Non-upgraded nodes, however, will not see nor validate the witness data and will consider all witness programs as anyone-can-spend scripts.

== Deployment ==

This BIP will be deployed by "version bits" BIP9 with the name "segwit" and using bit 1.

== Reference Implementation ==

https://github.com/bitcoin/bitcoin/pull/8149

== Copyright ==

This document is placed in the public domain.