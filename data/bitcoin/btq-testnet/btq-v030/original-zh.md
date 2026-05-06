# BTQ Bitcoin Quantum Testnet v0.3.0

> Source: BTQ Technologies Corp., March 2026
> https://www.btq.com/news/btq-technologies-launches-quantum-protected-bitcoin-testnet

---

## Overview

BTQ Technologies Corp. has released version v0.3.0 of the Bitcoin Quantum testnet — the first operational implementation of BIP-360, the Pay-to-Merkle-Root (P2MR) standard designed to protect Bitcoin transactions from quantum computer attacks.

The testnet is maintained by the Post-Quantum Bitcoin project and represents the most concrete step toward Bitcoin post-quantum migration to date.

---

## Key Innovations

### 1. Full P2MR Consensus (BIP-360)

- SegWit version 2 outputs with bc1z address encoding
- Removes the quantum-vulnerable key-path spend while preserving tapscript functionality
- Compatible with Lightning Network, BitVM, and multi-signature schemes

### 2. Five Dilithium Post-Quantum Signature Opcodes

| Opcode | Function |
|--------|----------|
| OP_DILITHIUM_GENERATEKEYPAIR | Generate a Dilithium keypair |
| OP_DILITHIUM_SIGN | Sign data with Dilithium |
| OP_DILITHIUM_VERIFY | Verify a Dilithium signature |
| OP_DILITHIUM_BATCHVERIFY | Batch-verify multiple signatures |
| OP_DILITHIUM_AGGREGATE | Aggregate multiple signatures |

These opcodes use ML-DSA (Dilithium), a NIST-standardized post-quantum signature algorithm, replacing ECDSA for quantum-vulnerable spending paths.

### 3. End-to-End CLI Wallet

- Full wallet lifecycle: create, send, receive, and monitor transactions
- Supports both legacy addresses and new bc1z P2MR addresses
- Built for developers to test post-quantum transactions in a live environment

### 4. Testnet Parameters (Optimized for Rapid Testing)

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Block time | 1 minute | Accelerated consensus testing |
| Block reward | 5 BTQ | Incentivize miner participation |
| Block size | 64 MiB | Accommodate large post-quantum signatures (Dilithium signatures are ~4.1 KB vs ECDSA's 65 bytes) |
| SegWit discount | Restored | Critical for post-quantum signatures, which would otherwise be prohibitively expensive |

### 5. Network Statistics (as of March 2026)

- **50+ miners** actively mining
- **100,000+ blocks** mined since launch
- **Active community** of developers testing post-quantum transactions

---

## Technical Details

### Address Format: bc1z

The new bc1z address type uses SegWit version 2 (compared to bc1q for v0 and bc1p for v1). Example:

```
bc1z7wn8plk2g6q4k8v0m3n5x9j2h4f6d8s0a1c3e5g7i9k0m2o4q6r8t0u2w4
```

### Why 64 MiB Blocks?

Post-quantum signatures are significantly larger than classical signatures:

| Signature Type | Size |
|----------------|------|
| ECDSA (secp256k1) | ~65 bytes |
| Schnorr | ~64 bytes |
| Dilithium-2 | ~2,420 bytes |
| Dilithium-3 | ~3,293 bytes |
| Dilithium-5 | ~4,595 bytes |

With restored SegWit discount (75% discount on witness data), the effective cost of Dilithium signatures is reduced, but larger blocks are still necessary for high throughput.

### Why Restore SegWit Discount?

In the current Bitcoin protocol, SegWit provides a 75% discount on witness data weight. However, post-quantum signatures are so large that even with this discount, transactions become expensive. BTQ testnet experiments with maintaining the discount to keep post-quantum transactions economically viable.

---

## Roadmap

| Phase | Target | Milestone |
|-------|--------|-----------|
| Q2 2026 | Mainnet launch | Production network with migration tools for existing Bitcoin holders |
| 2026-2027 | Exchange integration | Major exchanges add BTQ/bc1z support |
| 2027+ | Institutional custody | Post-quantum custody solutions for institutional holders |

---

## Team

- **BTQ Technologies Corp.** — Australian company specializing in post-quantum cryptography
- **Post-Quantum Bitcoin project** — Open-source testnet maintenance
- **BIP-360 authors**: Hunter Beast (MARA), Ethan Heilman, Isabel Foxen Duke

---

## Relationship to Bitcoin Mainnet

BTQ testnet is a **parallel experimental network**, not a direct proposal for Bitcoin mainnet. Its purpose is to:

1. Validate BIP-360 in a live environment
2. Test post-quantum signature performance under real network conditions
3. Gather data on block size, fee market, and miner incentives with post-quantum parameters
4. Provide a reference implementation for future Bitcoin soft forks

All findings from BTQ testnet feed back into the BIP-360/BIP-361 discussion for potential Bitcoin mainnet activation.
