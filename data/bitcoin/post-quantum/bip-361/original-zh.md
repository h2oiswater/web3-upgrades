# BIP-361: Post Quantum Migration and Legacy Signature Sunset

> 来源：https://github.com/bitcoin/bips/blob/master/bip-0361.mediawiki

---

## Abstract

This proposal follows the implementation of any post-quantum (PQ) output type and introduces a pre-announced sunset of legacy ECDSA/Schnorr signatures. It turns quantum security into a private incentive: fail to upgrade and you will encounter additional friction to access your funds, creating a certainty where none previously existed.

**Phase A**: Disallows sending of any funds to quantum-vulnerable addresses, hastening the adoption of PQ address types.

**Phase B**: Restricts ECDSA/Schnorr spends by encumbering them with a quantum-safe rescue protocol, preventing theft of funds in quantum-vulnerable UTXOs. This is triggered by a well-publicized flag-day five years after activation.

---

## Motivation

We seek to secure the value of the UTXO set and minimize incentives for quantum attacks. This proposal is radically different from any in Bitcoin's history just as the threat posed by quantum computing is radically different from any other threat in Bitcoin's history. Never before has Bitcoin faced an existential threat to its cryptographic primitives.

**Accelerating quantum progress.**

NIST ratified three production-grade PQ signature schemes in 2024; academic road-maps now estimate a cryptographically-relevant quantum computer as early as 2027-2030, per McKinsey.

**Quantum algorithms are rapidly improving.**

The safety envelope is shrinking by dramatic increases in algorithms even if the pace of hardware improvements is slower. Algorithms are improving up to 20X, lowering the theoretical hardware requirements for breaking classical encryption.

**Bitcoin's exposed public keys.**

As of March 1, 2026, over 34% of all bitcoin have revealed a public key on-chain; those UTXOs could be stolen by an attacker with a sufficiently powerful quantum computer.

**We may not know the attack is underway.**

Quantum attackers could compute the private key for known public keys then transfer all funds weeks or months later, in a covert bleed to not alert chain watchers. Q-Day may be only known much later if the attack withholds broadcasting transactions in order to postpone revealing their capabilities.

**Upgrade inertia.**

Coordinating wallets, exchanges, miners and custodians historically takes years. The longer we postpone migration, the harder it becomes. A clear, time-boxed pathway is the only credible defense.

---

## Specification

| Phase | What Happens | Who Must Act | Time Horizon |
|-------|-------------|--------------|--------------|
| A | Permitted sends are from legacy scripts to PQ scripts. | Everyone holding or accepting BTC. | 160,000 blocks (~3 years) after BIP-361 activation. |
| B | At a predetermined block height, nodes tighten requirements on verification of ECDSA/Schnorr. | Everyone holding or accepting BTC. | 2 years after Phase A activation. |

### Phase A

After activation, sending funds to quantum-vulnerable address types (P2PK, P2TR keypath, etc.) becomes invalid. Only sends to post-quantum address types are permitted.

This prevents new funds from entering vulnerable outputs, reducing the total attack surface.

### Phase B

Five years after activation (or 2 years after Phase A), a flag-day triggers:

- ECDSA/Schnorr signatures must be accompanied by a quantum-safe rescue protocol
- This protocol proves the spender is the legitimate owner (not a quantum attacker)
- The rescue protocol uses knowledge asymmetry: legitimate owners know things quantum attackers don't

### Rescue Protocol Ideas

Current research suggests using:

1. **BIP-32 hardened derivation**: Wallet seeds can prove parent XPriv knowledge that quantum attackers wouldn't have
2. **ZK-STARK proofs**: Can efficiently prove knowledge of private keys without revealing them
3. **Commit/reveal protocols**: Multi-step schemes where pre-commitments prove legitimacy

---

## Benefits

**Resilience**: Bitcoin protocol remains secure for the foreseeable future without waiting for a last-minute emergency.

**Certainty**: Bitcoin users and stakeholders gain certainty that a plan is both in place and being implemented.

**Clarity**: A single, publicized timeline aligns the entire ecosystem (wallets, exchanges, hardware vendors).

**Supply Discipline**: Abandoned keys that never migrate remain unspendable, reducing supply.

---

## Stakeholder Incentives

| Stakeholder | Incentive to Upgrade |
|-------------|---------------------|
| **Miners** | • Larger PQ signatures create more demand for block space = higher fees<br>• Post-Phase B, non-upgraded miners produce invalid blocks<br>• Quantum attack devalues both hardware and Bitcoin |
| **Institutional Holders** | • Fiduciary duty: failing to act violates duty to shareholders<br>• Demonstrates Bitcoin is investment-grade by handling emerging threats |
| **Exchanges & Custodians** | • Concentrated risk: quantum hack could bankrupt overnight<br>• Early migration is cheap vs. potential losses, lawsuits, reputational damage |
| **Individual Holders** | • Peace of mind against theft and devaluation<br>• Sunset date creates clear deadline vs. open-ended "some day" |
| **Attackers** | Economic incentive diminishes as sunset nears — stolen coins cannot be spent after Q-day |

---

## Key Insight

This proposal turns quantum security into a **private incentive** to upgrade:

> "Lost coins only make everyone else's coins worth slightly more. Think of it as a donation to everyone." — Satoshi Nakamoto

If true, the corollary is:

> "Quantum recovered coins only make everyone else's coins worth less. Think of it as a theft from everyone."

The timelines are meant to find the best balance between:
- Giving ample ability for account owners to migrate
- Maintaining ecosystem integrity to avoid catastrophic attacks

---

## Backward Compatibility

As a series of soft forks:
- Older nodes continue to operate without modification
- Non-upgraded nodes consider PQ witness programs as anyone-can-spend
- Strongly encouraged to upgrade to fully validate new programs

Non-upgraded wallets can receive and send until Phase A. After Phase A, they can only send to upgraded wallets. After Phase B, both senders and receivers require upgraded wallets.

This BIP is compatible with an "Hourglass" style BIP for spending P2PK encumbered funds, provided such a BIP has activated by the time Phase B activates.
