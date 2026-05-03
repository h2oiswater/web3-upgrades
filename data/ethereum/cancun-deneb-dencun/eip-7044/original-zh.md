# EIP-7044: 官方原文

> 来源：https://github.com/ethereum/EIPs/blob/master/EIPS/eip-7044.md

---

## Abstract

Lock validator voluntary exit signature domain on Capella for perpetual validity. Currently, signed voluntary exits are only valid for two upgrades.

---

## Motivation

Currently, signed voluntary exits are valid up-to only two upgrades for block inclusion due to the Beacon Chain state considering only the current and previous fork version. This limitation increases the complexity of some staking operations, specifically those in which the staking operator (holder of active key) is distinct from the owner of the funds (holder of the withdrawal credential). Because voluntary exits can only be signed by the active key, such a relationship requires the exchange of signed exits ahead of time for an unbounded number of forks.

The limited validity of voluntary exits was originally motivated to isolate them in the event of a hard fork that results in two maintained chains. If fork A and B exist and a validator operates on both, if they send an exit, it will be replayable on both. However, this possibility is not sufficient to justify the UX degradation exposed above, as no funds are at risk and the staker can re-stake on one or both of the chains.

---

## Specification

### Consensus Layer

Specification changes are built into the Consensus Specs Deneb upgrade.

The specific makes one change to the state transition function:

- Modify [`process_voluntary_exit`](https://github.com/ethereum/consensus-specs/blob/75971a8c218b1d76d605dd8b88a08d39c42de221/specs/deneb/beacon-chain.md#modified-process_voluntary_exit) to compute the signing domain and root fixed on `CAPELLA_FORK_VERSION`.

Additionally, the `voluntary_exit` gossip conditions are implicitly modified to support this change.

To make the change backwards compatible the signature domain is locked on the Capella fork

### Execution Layer

This specification does not require any changes to the Execution Layer.

---

## Rationale

Perpetually valid signed voluntary exits allow simpler staking operation designs. It also aligns the UX of such objects to `BLSToExecutionChanges` and deposits, such that downstream tooling does not need to be updated with fork version information.

---

## Security considerations

The divergent signature domains across forked networks would previously have prevented the replay of VoluntaryExits after two hard forks. This specification change causes the replay protection to no longer exist. These potential replays could impact individual stakers on both sides of a fork, but does not put funds at risk and does not impact the security of the chain.

---

