BIP: 143
Layer: Consensus (soft fork)
Title: Transaction Signature Verification for Version 0 Witness Program
Authors: Johnson Lau
           Pieter Wuille
Status: Deployed
Type: Specification
Assigned: 2016-01-03
License: PD

== Abstract ==
This proposal defines a new transaction digest algorithm for signature verification in version 0 witness program, in order to minimize redundant data hashing in verification, and to cover the input value by the signature.

== Motivation ==
There are 4 ECDSA signature verification codes in the original Bitcoin script system: CHECKSIG, CHECKSIGVERIFY, CHECKMULTISIG, CHECKMULTISIGVERIFY. The inefficiency of the existing algorithm made it necessary to limit the maximum number of sigops per block. With the introduction of BIP141, the size limit is no longer limited by the number of sigops, and the inefficiency becomes a significant factor.

Additionally, the original algorithm does not cover the value of the input being spent, which is a security risk for hardware wallets.

== Specification ==
This BIP defines a new transaction digest algorithm that:
1. Minimizes redundant data hashing during verification.
2. Covers the input value by the signature.

The new algorithm hashes the transaction data in a way that avoids re-hashing the same data multiple times.

== Compatibility ==
This is a soft fork. All old clients will recognize the new blocks as valid, but will not validate the witness data. Miners must upgrade to enforce the new rules.

== Reference implementation ==
https://github.com/bitcoin/bitcoin/pull/7956

== See Also ==
- [[bip-0141.mediawiki|BIP 141]]: Segregated Witness