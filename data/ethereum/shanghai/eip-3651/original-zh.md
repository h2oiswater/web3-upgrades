# EIP-3651: 官方原文

> 来源：https://github.com/ethereum/EIPs/blob/master/EIPS/eip-3651.md

---

## Abstract

The `COINBASE` address shall be warm at the start of transaction execution, in accordance with the actual cost of reading that account.

---

## Motivation

Direct `COINBASE` payments are becoming increasingly popular because they allow conditional payments, which provide benefits such as implicit cancellation of transactions that would revert.
But accessing `COINBASE` is overpriced; the address is initially cold under the access list framework introduced in [EIP-2929](./eip-2929.md).
This gas cost mismatch can incentivize alternative payments besides ETH, such as [ERC-20](./eip-20.md), but ETH should be the primary means of paying for transactions on Ethereum.

---

## Specification

At the start of transaction execution, `accessed_addresses` shall be initialized to also include the address returned by `COINBASE` (`0x41`).

---

## Rationale

The addresses currently initialized warm are the addresses that should already be loaded at the start of transaction validation.
The `ORIGIN` address is always loaded to check its balance against the gas limit and the gas price.
The `tx.to` address is always loaded to begin execution.
The `COINBASE` address should also be always be loaded because it receives the block reward and the transaction fees.

---

## Security considerations

There are no known security considerations introduced by this change.

---

