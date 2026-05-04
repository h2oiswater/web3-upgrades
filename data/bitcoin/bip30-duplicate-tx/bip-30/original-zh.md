BIP: 30
Layer: Consensus (soft fork)
Title: Duplicate transactions
Authors: Pieter Wuille
Status: Deployed
Type: Specification
Assigned: 2012-02-22
License: BSD-2-Clause

==Abstract==
This document gives a specification for dealing with duplicate transactions in the block chain, in an attempt to solve certain problems the reference implementation has with them.

==Copyright==
This BIP is licensed under the 2-clause BSD license.

==Motivation==
So far, the Bitcoin reference implementation always assumed duplicate transactions (transactions with the same identifier) did not exist in the block chain. However, for testing and various other reasons, duplicate transactions do exist in the block chain. This caused problems, for example the reference implementation does not correctly handle duplicate transactions.

==Specification==

===New validation rules===

The reference implementation's rule that a transaction output cannot be claimed more than once must be strictly enforced.

==Rationale==

The problems caused by duplicate transactions are:
1. A coinbase transaction might be duplicated, creating inflation out of thin air.
2. A non-coinbase transaction might be duplicated, causing the same coins to be spent again.

==Compatibility==
This is a hardcoded consensus rule change. All old clients will recognize the new blocks as valid, but might still have problems with duplicate transactions in old blocks. To fix this completely, all old blocks must be re-validated with the new rules.

==Reference implementation==
https://github.com/bitcoin/bitcoin/pull/1425