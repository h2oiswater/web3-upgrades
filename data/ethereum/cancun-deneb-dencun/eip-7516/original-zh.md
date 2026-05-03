# EIP-7516: 官方原文

> 来源：https://github.com/ethereum/EIPs/blob/master/EIPS/eip-7516.md

---

## Abstract

Add a `BLOBBASEFEE (0x4a)` instruction that returns the value of the blob base-fee of the current block it is executing in. It is the identical to [EIP-3198](./eip-3198.md) (`BASEFEE` opcode) except that it returns the blob base-fee as per [EIP-4844](./eip-4844.md).

---

## Motivation

The intended use case would be for contracts to get the value of the blob base-fee. This feature enables blob-data users to programmatically account for the blob gas price, eg:

- Allow rollup contracts to trustlessly account for blob data usage costs.
- Blob gas futures can be implemented based on it which allows for blob users to smooth out data blob costs.

---

## Specification

Add a `BLOBBASEFEE` instruction with opcode `0x4a`, with gas cost `2`.

| Op   | Input | Output | Cost |
|------|-------|--------|------|
| 0x4a | 0     | 1      | 2    |

`BLOBBASEFEE` returns the result of the `get_blob_gasprice(header) -> int` function as defined in [EIP-4844 §Gas accounting](./eip-4844.md#gas-accounting).

---

## Rationale

### Gas cost

The value of the blob base-fee is needed to process data-blob transactions. That means its value is already available before running the EVM code.
The instruction does not add extra complexity and additional read/write operations, hence the choice of `2` gas cost. This is also identical to [EIP-3198](./eip-3198.md) (`BASEFEE` opcode)'s cost as it just makes available data that is in the header.

---

## Security considerations

The value of the blob base-fee is not sensitive and is publicly accessible in the block header. There are no known security implications with this instruction.

---

