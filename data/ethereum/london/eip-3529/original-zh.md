# EIP-3529: 官方原文

> 来源：https://github.com/ethereum/EIPs/blob/master/EIPS/eip-3529.md

---

## Motivation

Gas refunds for `SSTORE` and `SELFDESTRUCT` were originally introduced to motivate application developers to write applications that practice "good state hygiene", clearing storage slots and contracts that are no longer needed. However, the benefits of this technique have proven to be far lower than anticipated, and gas refunds have had multiple unexpected harmful consequences:

* Refunds give rise to GasToken. GasToken has benefits in moving gas space from low-fee periods to high-fee periods, but it also has downsides to the network, particularly in exacerbating state size (as state slots are effectively used as a "battery" to save up gas) and inefficiently clogging blockchain gas usage
* Refunds increase block size variance. The theoretical maximum amount of actual gas consumed in a block is nearly twice the on-paper gas limit (as refunds add gas space for subsequent transactions in a block, though refunds are capped at 50% of a transaction's gas used). This is not fatal, but is still undesirable, especially given that refunds can be used to maintain 2x usage spikes for far longer than EIP-1559 can.

---

## Specification

### Parameters

| Constant | Value |
| - | - |
| `FORK_BLOCK` | TBD |
| `MAX_REFUND_QUOTIENT` | 5 |

For blocks where `block.number >= FORK_BLOCK`, the following changes apply.

1. Remove the `SELFDESTRUCT` refund.
2. Replace `SSTORE_CLEARS_SCHEDULE` (as defined in [EIP-2200](./eip-2200.md)) with `SSTORE_RESET_GAS + ACCESS_LIST_STORAGE_KEY_COST` (4,800 gas as of [EIP-2929](./eip-2929.md) + [EIP-2930](./eip-2930.md))
3. Reduce the max gas refunded after a transaction to `gas_used // MAX_REFUND_QUOTIENT`

Remark: Previously _max gas refunded_ was defined as `gas_used // 2`. Here we
name the constant `2` as `MAX_REFUND_QUOTIENT` and change its value to `5`.

---

## Rationale

In [EIP-2200](./eip-2200.md#specification), three cases for refunds were introduced:

1. If the original value is nonzero, and the new value is zero, add `SSTORE_CLEARS_SCHEDULE` (currently 15,000) gas to the refund counter
2. If the original value is zero, the current value is nonzero, and the new value is zero, add `SSTORE_SET_GAS - SLOAD_GAS` (currently 19,900) gas to the refund counter
3. If the original value is nonzero, the current value is a different nonzero value, and the new value equals the original value, add `SSTORE_RESET_GAS - SLOAD_GAS` (currently 4,900) gas to the refund counter

Of these three, only (1) enables gastokens and allows a block to expend more gas on execution than the block gas limit. (2) does not have this property, because for the 19,900 refund to be obtained, _the same storage slot_ must have been changed from zero to nonzero previously, costing 20,000 gas. The inability to obtain gas from clearing one storage slot and use it to edit another storage slot means that it cannot be used for gas tokens. Additionally, obtaining the refund requires _reverting_ the effect of the storage write and expansion, so the refunded gas does not contribute to a client's load in processing a block. (3) behaves similarly: the 4,900 refund can only be obtained when 5,000 gas had previously been spent on the same storage slot.

This EIP deals with case (1). We can establish under what conditions a gastoken is nonviable (ie. you cannot get more gas out of a storage slot than you put in) by using a similar "pairing" argument, mapping each refund to a previous expenditure in the same transaction on the same storage slot. lf a storage slot is changed to zero when its original value is nonzero, there are two possibilities:

1. This could be the first time that the storage slot is set to zero. In this case, we can pair this event with the `SSTORE_RESET_GAS + ACCESS_LIST_STORAGE_KEY_COST` minimum cost of reading and editing the storage slot for the first time.
2. This could be the second or later time that the storage slot is set to zero. In this case, we can pair this event with the most recent previous time that the value was set _away_ from zero, in which `SSTORE_CLEARS_SCHEDULE` gas is _removed_ from the refund.

For the second and later event, it does not matter what value `SSTORE_CLEARS_SCHEDULE` has, because every refund of that size is paired with a refund _removal_ of the same size. This leaves the first event. For the total gas expended on the slot to be guaranteed to be positive, we need `SSTORE_CLEARS_SCHEDULE <= SSTORE_RESET_GAS + ACCESS_LIST_STORAGE_KEY_COST`. And so this EIP simply decreases `SSTORE_CLEARS_SCHEDULE` to the sum of those two costs.

One alternative intuition for this EIP is that there will not be a net refund for clearing data that has not yet been read (which is often "useless" data), but there will continue to be a net refund for clearing data that has been read (which is likely to be "useful" data).

---

## Security considerations

Refunds are not visible to transaction execution, so this should not have any impact on transaction execution logic.

The maximum amount of gas that can be spent on execution in a block is limited to the gas limit, if we do not count zero-to-nonzero `SSTORE`s that were later reset back to zero. It is okay to not count those, because if such an `SSTORE` is reset, storage is not expanded and the client does not need to actually adjust the Merke tree; the gas consumption is refunded, but the effort normally required by the client to process those opcodes is also cancelled. **Clients should make sure to not do a storage write if `new_value = original_value`; this was a prudent optimization since the beginning of Ethereum but it becomes more important now.**

---

