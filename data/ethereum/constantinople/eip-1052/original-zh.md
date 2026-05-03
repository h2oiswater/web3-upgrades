# EIP-1052: 官方原文

> 来源：https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1052.md

---

## Abstract

This EIP specifies a new opcode, which returns the keccak256 hash of a contract's code.

---

## Motivation

Many contracts need to perform checks on a contract's bytecode, but do not necessarily need the bytecode itself. For instance, a contract may want to check if another contract's bytecode is one of a set of permitted implementations, or it may perform analyses on code and whitelist any contract with matching bytecode if the analysis passes.

Contracts can presently do this using the `EXTCODECOPY` (`0x3c`) opcode, but this is expensive, especially for large contracts, in cases where only the hash is required. As a result, we propose a new opcode, `EXTCODEHASH`, which returns the keccak256 hash of a contract's bytecode.

---

## Specification

A new opcode, `EXTCODEHASH`, is introduced, with number `0x3f`. The `EXTCODEHASH` 
takes one argument from the stack, zeros the first 96 bits 
and pushes to the stack the keccak256 hash of the code of the account 
at the address being the remaining 160 bits. 

In case the account does not exist or is empty (as defined by [EIP-161](./eip-161.md)) `0` is pushed to the stack.

In case the account does not have code the keccak256 hash of empty data
(i.e. `c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470`)
is pushed to the stack.

The gas cost of the `EXTCODEHASH` is 400.

---

## Rationale

As described in the motivation section, this opcode is widely useful, and saves 
on wasted gas in many cases.

The gas cost is the same as the gas cost for the `BALANCE` opcode because the 
execution of the `EXTCODEHASH` requires the same account lookup as in `BALANCE`.

Only the 20 last bytes of the argument are significant (the first 12 bytes are 
ignored) similarly to the semantics of the `BALANCE` (`0x31`), `EXTCODESIZE` (`0x3b`) and 
`EXTCODECOPY` (`0x3c`).

The `EXTCODEHASH` distinguishes accounts without code and non-existing accounts.
This is consistent with the way accounts are represented in the state trie.
This also allows smart contracts to check whether an account exists.

---

