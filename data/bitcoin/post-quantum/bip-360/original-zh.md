# BIP-360: Pay-to-Merkle-Root (P2MR)

> 来源：https://github.com/bitcoin/bips/blob/master/bip-0360.mediawiki

---

## Abstract

This document proposes a new output type: Pay-to-Merkle-Root (P2MR), via a soft fork. P2MR outputs operate with nearly the same functionality as P2TR (Pay-to-Taproot) outputs, but with the key path spend removed.

Through this modification, P2MR outputs allow developers to use script trees and tapscript in a manner that is:

1. resistant to long exposure attacks by Cryptographically Relevant Quantum Computers (CRQCs), and
2. resistant to future cryptanalytic approaches that may compromise the elliptic curve cryptography (ECC) used by Bitcoin.

It is worth noting that proposed P2MR outputs are only resistant to "long exposure attacks" on elliptic curve cryptography; that is, attacks on keys exposed for time periods longer than needed to confirm a spending transaction.

Protection against more sophisticated quantum attacks, including protection against private key recovery from public keys exposed in the mempool while a transaction is waiting to be confirmed (a.k.a. "short exposure attacks"), may require the introduction of post-quantum signatures in Bitcoin. We believe it's worth considering this path in the future and intend to offer a separate proposal for this purpose upon further research.

This document additionally defines "long exposure" and "short exposure" attacks, and other new terminology in the Glossary.

---

## Motivation

The primary threat to Bitcoin from Cryptographically Relevant Quantum Computers (CRQCs) is their potential to break the key cryptographic assumption which secures the digital signatures used in Bitcoin.

A Cryptographically Relevant Quantum Computer is an object which is only loosely defined by characteristics in quantum physics as of today. It could be understood in the context of this BIP and in Bitcoin that it's a hardware-agnostic computer supposed to have the architecture to keep coherent a sufficient number of logical qubits to be able to run Shor's algorithm in an efficient fashion.

More specifically, Shor's algorithm enables a CRQC to solve the Discrete Logarithm Problem (DLP) exponentially faster than classical methods. Shor's algorithm is believed to need 10^8 operations to break a 256-bit elliptic curve public key. This allows the derivation of private keys from public keys — a process referred to here as quantum key recovery.

While it is unclear when or if CRQCs will become viable in the future, we propose the addition of a quantum-resistant, script tree output type for those interested in this level of protection.

While some may balk at the potential threat of quantum computers to Bitcoin given their limited functionality to date, some others — including governments, corporations and some existing and potential Bitcoin users — are concerned about their potential for advancement.

The Commercial National Security Algorithm Suite (CNSA) 2.0, for instance, has mandated software and networking equipment to be upgraded to post-quantum schemes by 2030, with browsers and operating systems fully upgraded by 2033. Additionally, according to NIST IR 8547, Elliptic Curve Cryptography (ECC) is planned to be disallowed within the US federal government after 2035 (with an exception made for hybrid cryptography).

In the most optimistic case, wherein quantum computers never pose a significant risk to ECC, we understand that the possibility of quantum advancement alone may be influencing adoption and broad confidence in the Bitcoin network. In other words, we believe users' fear of quantum computers may be worth addressing regardless of CRQC viability.

As a conservative first step in this effort, we propose Pay-to-Merkle-Root (P2MR), a script tree output that can be used in a quantum resistant manner.

---

## Long Exposure vs Short Exposure Attacks

For clarity, this proposal specifically mitigates the risk of long exposure attacks on outputs that support tapscript and script trees.

A long exposure attack is an attack performed on exposed blockchain data, such as exposed public keys, or the scripts of spent outputs. These are likely to be the earliest quantum attacks made possible on Bitcoin, because attackers will have ample time — as much time as vulnerable keys are exposed — to carry out quantum key recovery.

Short exposure attacks, however, require faster quantum computers, because they must occur within the relatively short time that a transaction is unconfirmed in the mempool.

The following output types describes their long exposure attack vulnerability:

| Type | Vulnerable | Prefix | Example |
|------|------------|--------|---------|
| P2PK | Yes | Varies | 02103203b768951584fe9af6d9d9e6ff26a5f76e453212f19ba163774182ab8057f3eac |
| P2PKH | No* | 1 | 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa |
| P2MS | Yes | Varies | 52410496ec45f878b62c46c4be8e336dff7cc58df9b502178cc240e... |
| P2SH | No* | 3 | 3FkhZo7sGNue153xhgqPBcUaBsYvJW6tTx |
| P2WPKH | No* | bc1q | bc1qsnh5ktku9ztqeqfr89yrqjd05eh58nah884mku |
| P2WSH | No* | bc1q | bc1qvhu3557twysq2ldn6dut6rmaj3qk04p60h9l79wk4lzgy0ca8mfsnffz65 |
| P2TR | Yes | bc1p | bc1p92aslsnseq786wxfk3ekra90ds9ku47qttupfjsqmmj4z82xdq4q3rr58u |
| P2MR | No* | bc1z | bc1zzmv50jjgxxhww6ve4g5zpewrkjqhr06fyujpm20tuezdlxmfphcqfc80ve |

---

## Design

Pay-to-Merkle-Root (P2MR) is a proposed new output type that commits to the root of a script tree. It operates with nearly the same functionality as P2TR (Pay-to-Taproot) outputs, but with the quantum vulnerable key path spend removed.

In other words, P2MR outputs commit to the Merkle root of a script tree without committing to an internal key. The script(s) being committed to, however, may contain a key or key-hash.

This output type is designed to offer users protection against long exposure quantum attacks as well as a practical output type with which post-quantum signatures may be used if such signatures are adopted in the future.

Since P2MR outputs have no key path spend, they omit the Taproot internal key. Instead, a P2MR output includes the 32-byte root of the script tree as defined in BIP 341 hashed with the tag "TapBranch".

A P2MR input witness provides the following:

- initial stack element 0, ... initial stack element N,
- leaf script,
- control block = [control byte, 32*m byte Merkle path] # m is the depth of the script in the Merkle tree

The initial stack elements of P2MR follow the same rules as P2TR script path spends.

---

## Specification

### Address Format

P2MR outputs use SegWit version 2, resulting in mainnet addresses that start with `bc1z`, following BIP 173. Bech32m encoding maps version 2 to the prefix `z`.

Example P2MR address: `bc1zzmv50jjgxxhww6ve4g5zpewrkjqhr06fyujpm20tuezdlxmfphcqfc80ve`

This commits to a 32-byte script tree Merkle root.

### ScriptPubKey

The `scriptPubKey` for a P2MR output is: `OP_2 OP_PUSHBYTES_32 <merkle_root>`

Where:
- `OP_2` indicates SegWit version 2.
- `<merkle_root>` is the 32-byte Merkle root of the script tree.

---

## Backward Compatibility

Older wallets and nodes that have not been made compatible with SegWit version 2 and P2MR will not understand these outputs. Per BIP 350 older wallets should be able to spend funds to SegWit version 2 outputs. Users should ensure they are using updated wallets and nodes to receive P2MR outputs and validate transactions using P2MR outputs.

P2MR is fully compatible with tapscript and existing tapscript programs can be used in P2MR outputs without modification. P2MR can also support future scripts with new leaf versions.

---

## Security

P2MR outputs provide the same tapscript functionality as P2TR outputs, but with the quantum-vulnerable key path spend removed. The similarity between these output types enables users to easily migrate script trees from P2TR outputs to P2MR outputs for protection against long exposure quantum attacks.

P2MR does not, by itself, protect against short exposure quantum attacks, but these attacks can be mitigated by future activation of post-quantum signatures. Combined with P2MR, post-quantum signature schemes can provide comprehensive quantum resistance to P2MR outputs, including protection from short exposure attacks.

---

## Glossary

**Quantum Key Recovery**: The derivation of private keys from public keys in elliptic curve cryptography (ECC), made possible by solving the discrete logarithm problem (DLP) using Shor's algorithm.

**Long Exposure Attacks**: Attempts to derive private keys from public keys that are exposed for an extended period of time; that is, longer than the window of time that a public key is generally exposed in the mempool while waiting to be confirmed.

**Short Exposure Attacks**: Attempts to derive private keys from public keys during the brief period when funds are unconfirmed in the mempool.

**Pay-to-Merkle-Root (P2MR)**: A script tree output type, similar to Pay-to-Taproot (P2TR), but with the quantum-vulnerable key path spend removed.
