# EIP-6049: 官方原文

> 来源：https://github.com/ethereum/EIPs/blob/master/EIPS/eip-6049.md

---

## Abstract

This EIP deprecates the `SELFDESTRUCT` opcode and warns against its use. A breaking change to this functionality is likely to come in the future.

---

## Motivation

Discussions about how to change `SELFDESTRUCT` are ongoing. But there is a strong consensus that *something* will change.

---

## Specification

Documentation of the `SELFDESTRUCT` opcode is updated to warn against its use and to note that a breaking change may be forthcoming.

---

## Rationale

As time goes on, the cost of doing something increases, because any change to `SELFDESTRUCT` will be a breaking change.

The Ethereum Blog and other official sources have not provided any warning to developers about a potential forthcoming change.

---

## Security considerations

None.

---

