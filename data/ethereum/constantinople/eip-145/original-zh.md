# EIP-145: 官方原文

> 来源：https://github.com/ethereum/EIPs/blob/master/EIPS/eip-145.md

---

## Abstract

Native bitwise shifting instructions are introduced, which are more efficient processing wise on the host and are cheaper to use by a contract.

---

## Motivation

EVM is lacking bitwise shifting operators, but supports other logical and arithmetic operators. Shift operations can be implemented via arithmetic operators, but that has a higher cost and requires more processing time from the host. Implementing `SHL` and `SHR` using arithmetic cost each 35 gas, while the proposed instructions take 3 gas.

---

## Specification

The following instructions are introduced:

### `0x1b`: `SHL` (shift left)

The `SHL` instruction (shift left) pops 2 values from the stack, first `arg1` and then `arg2`, and pushes on the stack `arg2` shifted to the left by `arg1` number of bits. The result is equal to

```
(arg2 * 2^arg1) mod 2^256
```

Notes:

- The value (`arg2`) is interpreted as an unsigned number.
- The shift amount (`arg1`) is interpreted as an unsigned number.
- If the shift amount (`arg1`) is greater or equal 256 the result is 0.
- This is equivalent to `PUSH1 2 EXP MUL`.

### `0x1c`: `SHR` (logical shift right)

The `SHR` instruction (logical shift right) pops 2 values from the stack, first `arg1` and then `arg2`, and pushes on the stack `arg2` shifted to the right by `arg1` number of bits with zero fill. The result is equal to

```
floor(arg2 / 2^arg1)
```

Notes:

- The value (`arg2`) is interpreted as an unsigned number.
- The shift amount (`arg1`) is interpreted as an unsigned number.
- If the shift amount (`arg1`) is greater or equal 256 the result is 0.
- This is equivalent to `PUSH1 2 EXP DIV`.

### `0x1d`: `SAR` (arithmetic shift right)

The `SAR` instruction (arithmetic shift right) pops 2 values from the stack, first `arg1` and then `arg2`, and pushes on the stack `arg2` shifted to the right by `arg1` number of bits with sign extension. The result is equal to

```
floor(arg2 / 2^arg1)
```

Notes:

- The value (`arg2`) is interpreted as a signed number.
- The shift amount (`arg1`) is interpreted as an unsigned number.
- If the shift amount (`arg1`) is greater or equal 256 the result is 0 if `arg2` is non-negative or -1 if `arg2` is negative.
- This is **not** equivalent to `PUSH1 2 EXP SDIV`, since it rounds differently. See `SDIV(-1, 2) == 0`, while `SAR(-1, 1) == -1`.

The cost of the shift instructions is set at `verylow` tier (3 gas).

---

## Rationale

Instruction operands were chosen to fit the more natural use case of shifting a value already on the stack. This means the operand order is swapped compared to most arithmetic instructions.

---

