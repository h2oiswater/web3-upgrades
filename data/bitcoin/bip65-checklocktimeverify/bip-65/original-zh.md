BIP: 65
Layer: Consensus (soft fork)
Title: OP_CHECKLOCKTIMEVERIFY
Authors: Peter Todd
Status: Deployed
Type: Specification
Assigned: 2014-10-01
License: PD

==Abstract==

This BIP describes a new opcode (OP_CHECKLOCKTIMEVERIFY) for the Bitcoin
scripting system that allows a transaction output to be made unspendable until
some point in the future.

==Summary==

CHECKLOCKTIMEVERIFY redefines the existing NOP2 opcode. When executed, if
any of the following conditions are true, the script interpreter will terminate
with an error:

* the stack is empty; or
* the top item on the stack is less than 0; or
* the lock-time type (height vs. timestamp) of the top stack item and the
  nLockTime field are not the same; or
* the top stack item is greater than the transaction's nLockTime field; or
* the transaction's nLockTime field is greater than 0 and the sequence field
  for this input is 0xffffffff.

Otherwise, the script interpreter will continue as if a NOP had been executed.

==Motivation==

The purpose of this proposal is to enable a specific transaction output to be
made unspendable until some point in the future.

This is a very useful primitive:

===Payment Channels===
A lightning network in the style of Duplex Micropayment Channels (see #A) can
be built with a single on-chain transaction, using CLTV.

===Proving sacrifice to miners' fees===
A transaction can be created that sends funds to an output that can only be
spent after a long time, proving that the funds are being sacrificed to miners.

===Escrow on top of multisig===
Funds can be locked until a future time, after which they can be spent if a
multisig condition is met.

==Specification==

Refer to the BIP for full specification.

==Compatibility==

This is a soft fork. All old clients will recognize the new blocks as valid.
Miners must upgrade to enforce the new rules.

==Reference implementation==
https://github.com/bitcoin/bitcoin/pull/6124