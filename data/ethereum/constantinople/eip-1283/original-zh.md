# EIP-1283: 官方原文

> 来源：https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1283.md

---

## Abstract

This EIP proposes net gas metering changes for `SSTORE` opcode, enabling
new usages for contract storage, and reducing excessive gas costs
where it doesn't match how most implementations work.

This acts as an alternative for EIP-1087, where it tries to be
friendlier to implementations that use different optimization
strategies for storage change caches.

---

## Motivation

This EIP proposes a way for gas metering on SSTORE (as an alternative
for EIP-1087 and EIP-1153), using information that is more universally
available to most implementations, and requires as little change in
implementation structures as possible.

* *Storage slot's original value*.
* *Storage slot's current value*. 
* Refund counter.

Usages that benefits from this EIP's gas reduction scheme includes:

* Subsequent storage write operations within the same call frame. This
  includes reentry locks, same-contract multi-send, etc.
* Exchange storage information between sub call frame and parent call
  frame, where this information does not need to be persistent outside
  of a transaction. This includes sub-frame error codes and message
  passing, etc.

---

## Specification

Definitions of terms are as below:

* *Storage slot's original value*: This is the value of the storage if
  a reversion happens on the *current transaction*.
* *Storage slot's current value*: This is the value of the storage
  before SSTORE operation happens.
* *Storage slot's new value*: This is the value of the storage after
  SSTORE operation happens.

Replace `SSTORE` opcode gas cost calculation (including refunds) with
the following logic:

* If *current value* equals *new value* (this is a no-op), 200 gas is
  deducted.
* If *current value* does not equal *new value*
  * If *original value* equals *current value* (this storage slot has
    not been changed by the current execution context)
    * If *original value* is 0, 20000 gas is deducted.
    * Otherwise, 5000 gas is deducted. If *new value* is 0, add 15000
      gas to refund counter.
  * If *original value* does not equal *current value* (this storage
    slot is dirty), 200 gas is deducted. Apply both of the following
    clauses.
    * If *original value* is not 0
      * If *current value* is 0 (also means that *new value* is not
        0), remove 15000 gas from refund counter. We can prove that
        refund counter will never go below 0.
      * If *new value* is 0 (also means that *current value* is not
        0), add 15000 gas to refund counter.
    * If *original value* equals *new value* (this storage slot is
      reset)
      * If *original value* is 0, add 19800 gas to refund counter.
      * Otherwise, add 4800 gas to refund counter.

Refund counter works as before -- it is limited to half of the gas
consumed. On a transaction level, refund counter will never go below
zero. However, there are some important notes depending on the
implementation details:

* If an implementation uses "transaction level" refund counter (refund
  is checkpointed at each call frame), then the refund counter
  continues to be unsigned.
* If an implementation uses "execution-frame level" refund counter
  (a new refund counter is created at each call frame, and then merged
  back to parent when the call frame finishes), then the refund
  counter needs to be changed to signed -- at internal calls, a child
  refund can go below zero.

---

## Rationale

This EIP mostly achieves what a transient storage tries to do
(EIP-1087 and EIP-1153), but without the complexity of introducing the
concept of "dirty maps", or an extra storage struct.

* We don't suffer from the optimization limitation of
  EIP-1087. EIP-1087 requires keeping a dirty map for storage changes,
  and implicitly makes the assumption that a transaction's storage
  changes are committed to the storage trie at the end of a
  transaction. This works well for some implementations, but not for
  others. After EIP-658, an efficient storage cache implementation
  would probably use an in-memory trie (without RLP encoding/decoding)
  or other immutable data structures to keep track of storage changes,
  and only commit changes at the end of a block. For them, it is
  possible to know a storage's original value and current value, but
  it is not possible to iterate over all storage changes without
  incurring additional memory or processing costs.
* It never costs more gas compared with the current scheme.
* It covers all usages for a transient storage. Clients that are easy
  to implement EIP-1087 will also be easy to implement this
  specification. Some other clients might require a little bit extra
  refactoring on this. Nonetheless, no extra memory or processing cost
  is needed on runtime.

Regarding `SSTORE` gas cost and refunds, see Appendix for proofs of
properties that this EIP satisfies.

* For *absolute gas used* (that is, actual *gas used* minus *refund*),
  this EIP is equivalent to EIP-1087 for all cases.
* For one particular case, where a storage slot is changed, reset to
  its original value, and then changed again, EIP-1283 would move more
  gases to refund counter compared with EIP-1087.

Examine examples provided in EIP-1087's Motivation:

* If a contract with empty storage sets slot 0 to 1, then back to 0,
  it will be charged `20000 + 200 - 19800 = 400` gas.
* A contract with empty storage that increments slot 0 5 times will be
  charged `20000 + 5 * 200 = 21000` gas.
* A balance transfer from account A to account B followed by a
  transfer from B to C, with all accounts having nonzero starting and
  ending balances, it will cost `5000 * 3 + 200 - 4800 = 10400` gas.

---

