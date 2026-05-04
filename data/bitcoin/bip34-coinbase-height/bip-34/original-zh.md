BIP: 34
Layer: Consensus (soft fork)
Title: Block v2, Height in Coinbase
Authors: Gavin Andresen
Status: Deployed
Type: Specification
Assigned: 2012-07-06

==Abstract==

Bitcoin blocks and transactions are versioned binary structures. Both currently use version 1. This BIP introduces an upgrade path for versioned transactions and blocks. A unique value is added to newly produced coinbase transactions, and blocks are updated to version 2.

==Motivation==
# Clarify and exercise the mechanism whereby the bitcoin network collectively consents to upgrade transaction or block binary structures.
# Enforce block height in coinbase to protect against a chain reorganizing into the pre-BIP34 chain.

==Specification==

===Block version number is calculated according to a policy known as "versionbits". However, in this BIP the policy is always active, which means that miners can't avoid voting for this BIP by producing version 1 blocks.===

===Coinbase transaction rule===
The first serialized 64-bits of the coinbase field must consist of the block height. The block height must be encoded as a CScriptNum serialization. Most full nodes will require the new format starting from block height 227931.

==Rationale==
This BIP is not only a good way to introduce the mechanism of binary upgrade, but also a simple and necessary bug fix for the long term. Without this fix, a miner might reuse a coinbase when forking the chain, which would accidentally duplicate the coinbase transaction and thus the subsidy.

==Compatibility==

This is a hardcoded consensus rule change. All old clients will recognize the new blocks as valid. Old miners can still produce version 1 blocks, but their blocks will be orphaned by the new rules.

==Reference implementation==
https://github.com/bitcoin/bitcoin/pull/1526