BIP: 112
Layer: Consensus (soft fork)
Title: CHECKSEQUENCEVERIFY
Authors: BtcDrak
           Mark Friedenbach
           Eric Lombrozo
Status: Deployed
Type: Specification
Assigned: 2015-08-10
License: PD

==Abstract==

This BIP describes a new opcode (CHECKSEQUENCEVERIFY) for the Bitcoin scripting system that in combination with BIP 68 allows execution pathways of a script to be restricted based on the age of the output being spent.

==Summary==

CHECKSEQUENCEVERIFY redefines the existing NOP3 opcode. When executed, if any of the following conditions are true, the script interpreter will terminate with an error:

* the stack is empty; or
* the top item on the stack is less than 0; or
* the transaction version number is less than 2; or
* the transaction input sequence number disable flag (1 << 31) is set; or
* the relative lock-time type is not the same; or
* the top stack item is greater than the transaction input sequence (when masked according to the BIP68).

Otherwise, the script interpreter will continue as if a NOP had been executed.

==Motivation==

CHECKSEQUENCEVERIFY, in conjunction with BIP 68, allows execution pathways of a script to be restricted based on the age of the output being spent.

This enables:

===Bidirectional Payment Channels===
By using a time-locked refund and a sequence-locked second transaction, a bidirectional payment channel can be constructed.

===Lightning Network===
The Lightning Network uses relative lock-time to allow participants to safely update channel state.

===Hash Time Locked Contracts===
HTLCs can use relative lock-time instead of absolute lock-time.

===Escrow with Timeout===
Funds can be locked for a relative period, after which they can be spent.

==Specification==

Refer to the BIP for full specification.

==Compatibility==

This is a soft fork. All old clients will recognize the new blocks as valid. Miners must upgrade to enforce the new rules.

==Reference implementation==
https://github.com/bitcoin/bitcoin/pull/7524

==See Also==
- [[bip-0068.mediawiki|BIP 68]]: Relative lock-time