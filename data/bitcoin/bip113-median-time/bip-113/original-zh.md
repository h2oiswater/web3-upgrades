BIP: 113
Layer: Consensus (soft fork)
Title: Median time-past as endpoint for lock-time calculations
Authors: Thomas Kerin
           Mark Friedenbach
Status: Deployed
Type: Specification
Assigned: 2015-08-10
License: PD

==Abstract==

This BIP is a proposal to redefine the semantics used in determining a time-locked transaction's eligibility for inclusion in a block. The median of the last 11 blocks is used instead of the block's timestamp, ensuring that it increases monotonically with each block.

==Motivation==

At present, transactions are excluded from inclusion in a block if the transaction's nLockTime or input nSequence is greater than the block's timestamp.

This is the case even if the block's timestamp is less than the previous block's timestamp, which can happen due to miner manipulation or natural clock drift.

This BIP proposes using the median of the last 11 blocks as the comparison value instead.

==Specification==

A time-locked transaction is eligible for inclusion in a block if its lock-time is less than or equal to the median-time-past of the previous 11 blocks.

==Rationale==

Using the median-time-past ensures that the time used for lock-time calculations never goes backwards, which prevents a number of potential attacks and makes time-locked transactions more reliable.

==Compatibility==

This is a soft fork. All old clients will recognize the new blocks as valid. Miners must upgrade to enforce the new rules.

==Reference implementation==
https://github.com/bitcoin/bitcoin/pull/6566