BIP: 347
Layer: Consensus (soft fork)
Title: OP_CAT in Tapscript
Authors: Ethan Heilman
           Armin Sabouri
Status: Complete
Type: Specification
Assigned: 2023-12-11
License: BSD-3-Clause
Version: 1.0.0
Requires: 340, 341, 342

==Abstract==

This BIP introduces OP_CAT as a tapscript opcode which allows the concatenation of two values on the stack. OP_CAT would be activated via a soft fork by redefining the opcode OP_SUCCESS126 (126 in decimal and 0x7e in hexadecimal). This is the same opcode value used by the original OP_CAT.

==Specification==

When evaluated, the OP_CAT instruction:
1. Pops the top two values off the stack
2. Concatenates the popped values together in stack order
3. Pushes the concatenated value on the top of the stack

Given the stack [x1, x2], where x2 is at the top of the stack, OP_CAT will push x1 || x2 onto the stack. OP_CAT fails if there are fewer than two values on the stack or if a concatenated value would have a combined size greater than the maximum script element size of 520 bytes.

==Motivation==

Bitcoin Tapscript lacks a general purpose way of combining objects on the stack, restricting the expressiveness and power of Tapscript. OP_CAT enables:

* BitStream protocol for decentralized file hosting
* Tree signatures for logarithmic multisignature scaling
* Post-quantum Lamport signatures in Bitcoin transactions
* Non-equivocation contracts for payment channels
* Vaults for cold storage security
* CheckSigFromStack replication for simple covenants
* Arbitrary computation on stack elements larger than 32-bits
* BitVM2 bridge improvements

==Rationale==

The decision to reenable OP_CAT by redefining a tapscript OP_SUCCESSx opcode leverages the tapscript softfork upgrade path introduced in BIP342. OP_SUCCESS126 was specifically chosen as it uses the same opcode value (0x7e) that was used for OP_CAT prior to being disabled in Bitcoin in 2010.

In 2010, OP_CAT was disabled because it enabled scripts whose evaluation could have memory usage exponential in the size of the script. This is no longer an issue because tapscript enforces a maximum stack element size of 520 bytes.

==Backwards Compatibility==

OP_CAT usage in a non-tapscript script will continue to trigger SCRIPT_ERR_DISABLED_OPCODE. The only change would be to OP_CAT usage in tapscript. This change would be activated as a soft fork that redefines an OP_SUCCESSx opcode to OP_CAT.

==Reference implementation==

```
case OP_CAT:
{
  if (stack.size() < 2)
    return set_error(serror, SCRIPT_ERR_INVALID_STACK_OPERATION);
  valtype& vch1 = stacktop(-2);
  valtype& vch2 = stacktop(-1);
  if (vch1.size() + vch2.size() > MAX_SCRIPT_ELEMENT_SIZE)
    return set_error(serror, SCRIPT_ERR_PUSH_SIZE);
  vch1.insert(vch1.end(), vch2.begin(), vch2.end());
  stack.pop_back();
}
break;
```

The value of MAX_SCRIPT_ELEMENT_SIZE is 520.

==Copyright==

This document is licensed under the 3-clause BSD license.