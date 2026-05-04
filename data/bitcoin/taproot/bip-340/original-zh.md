BIP: 340
Title: Schnorr Signatures for secp256k1
Authors: Pieter Wuille
           Jonas Nick
           Tim Ruffing
Comments-Summary: No comments yet.
Comments-URI: https://github.com/bitcoin/bips/wiki/Comments:BIP-0340
Status: Deployed
Type: Specification
Assigned: 2020-01-19
License: BSD-2-Clause
License-Code: BSD-2-Clause OR MIT OR CC0-1.0
Discussion: 2018-07-06: https://lists.linuxfoundation.org/pipermail/bitcoin-dev/2018-July/016203.html [bitcoin-dev] Schnorr signatures BIP

== Introduction ==

=== Abstract ===

This document proposes a standard for 64-byte Schnorr signatures over the elliptic curve secp256k1.

=== Copyright ===

This BIP is licensed under the 2-clause BSD license.

=== Motivation ===

Bitcoin has traditionally used ECDSA signatures over the secp256k1 curve for authenticating transactions. These are standardized, but have a number of downsides:

1. **Encoding issues**: ECDSA signatures are encoded in DER format, which is variable-length and complex. This makes them more difficult to parse and can lead to malleability issues.
2. **Batch verification**: ECDSA signatures cannot be efficiently batch verified, which is a significant scalability limitation.
3. **Signature size**: ECDSA signatures are typically 70-72 bytes, whereas Schnorr signatures are always 64 bytes.
4. **Security proofs**: Schnorr signatures have a simpler security proof and are better understood.
5. **Threshold signatures**: Schnorr signatures support threshold signatures and multi-signatures more naturally.

Schnorr signatures have been proposed for Bitcoin since at least 2012. This BIP standardizes a specific implementation.

== Specification ==

=== Signature Encoding ===

A Schnorr signature is a 64-byte value, encoded as:
- 32 bytes for the public nonce point R
- 32 bytes for the scalar s

This is much simpler than DER-encoded ECDSA signatures.

=== Signature Verification ===

The signature is valid if s*G = R + H(R || P || m)*P, where:
- G is the generator point
- P is the public key
- m is the message
- H is the hash function

=== Public Key Encoding ===

Public keys are encoded as 32-byte x-coordinates. The y-coordinate is not included, which halves the public key size.

=== Batch Verification ===

Multiple Schnorr signatures can be verified in a single operation, which is significantly faster than verifying them individually.

== Rationale ==

The specific choices in this BIP were made to:
1. Maximize security
2. Minimize signature size
3. Enable batch verification
4. Support threshold signatures

== Compatibility ==

This is a soft fork deployed as part of the Taproot upgrade (BIP 341/342).

== Reference implementation ==
https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki