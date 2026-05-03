# EIP-196: 官方原文

> 来源：https://github.com/ethereum/EIPs/blob/master/EIPS/eip-196.md

---

## Abstract

This EIP suggests to add precompiled contracts for addition and scalar multiplication on a specific pairing-friendly elliptic curve. This can in turn be combined with [EIP-197](./eip-197.md) to verify zkSNARKs in Ethereum smart contracts. The general benefit of zkSNARKs for Ethereum is that it will increase the privacy for users (because of the Zero-Knowledge property) and might also be a scalability solution (because of the succinctness and efficient verifiability property).

---

## Motivation

Current smart contract executions on Ethereum are fully transparent, which makes them unsuitable for several use-cases that involve private information like the location, identity or history of past transactions. The technology of zkSNARKs could be a solution to this problem. While the Ethereum Virtual Machine can make use of zkSNARKs in theory, they are currently too expensive
to fit the block gas limit. Because of that, this EIP proposes to specify certain parameters for some elementary primitives that enable zkSNARKs so that they can be implemented more efficiently and the gas cost be reduced.

Note that while fixing these parameters might look like limiting the use-cases for zkSNARKs, the primitives are so basic that they can be combined in ways that are flexible enough so that it should even be possible to allow future advances in zkSNARK research without the need for a further hard fork.

---

## Specification

If `block.number >= BYZANTIUM_FORK_BLKNUM`, add precompiled contracts for point addition (ADD)  and scalar multiplication (MUL) on the elliptic curve "alt_bn128".

Address of ADD: 0x6
Address for MUL: 0x7

The curve is defined by:
```
Y^2 = X^3 + 3
over the field F_p with
p = 21888242871839275222246405745257275088696311157297823662689037894645226208583
```

### Encoding

Field elements and scalars are encoded as 32 byte big-endian numbers. Curve points are encoded as two field elements `(x, y)`, where the point at infinity is encoded as `(0, 0)`.

Tuples of objects are encoded as their concatenation.

For both precompiled contracts, if the input is shorter than expected, it is assumed to be virtually padded with zeros at the end (i.e. compatible with the semantics of the `CALLDATALOAD` opcode). If the input is longer than expected, surplus bytes at the end are ignored.

The length of the returned data is always as specified (i.e. it is not "unpadded").

### Exact semantics

Invalid input: For both contracts, if any input point does not lie on the curve or any of the field elements (point coordinates) is equal or larger than the field modulus p, the contract fails. The scalar can be any number between `0` and `2**256-1`.

#### ADD
Input: two curve points `(x, y)`.
Output: curve point `x + y`, where `+` is point addition on the elliptic curve `alt_bn128` specified above.
Fails on invalid input and consumes all gas provided.

#### MUL
Input: curve point and scalar `(x, s)`.
Output: curve point `s * x`, where `*` is the scalar multiplication on the elliptic curve `alt_bn128` specified above.
Fails on invalid input and consumes all gas.

### Gas costs

 - Gas cost for ``ECADD``: 500
 - Gas cost for ``ECMUL``: 40000

---

## Rationale

The specific curve `alt_bn128` was chosen because it is particularly well-suited for zkSNARKs, or, more specifically their verification building block of pairing functions. Furthermore, by choosing this curve, we can use synergy effects with ZCash and re-use some of their components and artifacts.

The feature of adding curve and field parameters to the inputs was considered but ultimately rejected since it complicates the specification: The gas costs are much harder to determine and it would be possible to call the contracts on something which is not an actual elliptic curve.

A non-compact point encoding was chosen since it still allows to perform some operations in the smart contract itself (inclusion of the full y coordinate) and two encoded points can be compared for equality (no third projective coordinate).

---

