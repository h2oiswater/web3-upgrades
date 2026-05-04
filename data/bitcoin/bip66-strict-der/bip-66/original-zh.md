BIP: 66
Layer: Consensus (soft fork)
Title: Strict DER signatures
Authors: Pieter Wuille
Status: Deployed
Type: Specification
Assigned: 2015-01-10
License: BSD-2-Clause

==Abstract==

This document specifies proposed changes to the Bitcoin transaction validity rules to restrict signatures to strict DER encoding.

==Copyright==

This BIP is licensed under the 2-clause BSD license.

==Motivation==

Bitcoin's reference implementation currently relies on OpenSSL for signature validation, which means it is implicitly defining Bitcoin's block validity rules. Unfortunately, OpenSSL is not strict in its DER signature parsing, which means that extra data can be added to a signature after it, which is still considered valid by OpenSSL but not by other implementations.

This has already led to a block chain fork in 2013, where some versions of Bitcoin rejected a block because they interpreted the rules differently.

==Specification==

All signatures in Bitcoin must use strict DER encoding. Any non-strict DER signature is invalid.

===DER encoding===

A correct DER-encoded signature has the following structure:

0x30 <length of whole thing>
  0x02 <length of r> <r>
  0x02 <length of s> <s>

The length of r and s must be minimal (no leading zero bytes unless necessary).

==Rationale==

By enforcing strict DER encoding, we eliminate the dependency on OpenSSL's behavior and make the consensus rules explicit and self-contained.

==Compatibility==

This is a soft fork. All old clients will recognize the new blocks as valid. Miners must upgrade to enforce the new rules.

==Reference implementation==
https://github.com/bitcoin/bitcoin/pull/5713