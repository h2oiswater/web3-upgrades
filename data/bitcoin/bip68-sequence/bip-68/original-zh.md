BIP: 68
Layer: Consensus (soft fork)
Title: Relative lock-time using consensus-enforced sequence numbers
Authors: Mark Friedenbach
           BtcDrak
           Nicolas Dorier
           kinoshitajona
Status: Deployed
Type: Specification
Assigned: 2015-05-28

==Abstract==

This BIP introduces relative lock-time (RLT) consensus-enforced semantics of the sequence number field to enable a signed transaction input to remain invalid for a defined period of time after confirmation of its corresponding outpoint.

==Motivation==

Bitcoin transactions have a sequence number field for each input. The original idea was that a higher sequence number would supersede an older one in a double-spend situation. However this was never implemented and the sequence number is currently unused.

This BIP proposes using the sequence number to enforce relative lock-time.

==Specification==

If bit (1 << 31) of the sequence number is set, the sequence number has no consensus meaning.

If bit (1 << 31) of the sequence number is not set, the sequence number is interpreted as follows:

Bit (1 << 22) determines the type:
- If set, the sequence number is interpreted as a time-based relative lock-time.
- If not set, the sequence number is interpreted as a block-height-based relative lock-time.

Bits 0-15 are used as the relative lock-time value.

Bits 16-21 are reserved for future use and must be 0.

==Rationale==

This approach uses the existing sequence number field, which is currently unused, to implement a very useful feature without requiring any additional fields.

==Compatibility==

This is a soft fork. All old clients will recognize the new blocks as valid. Miners must upgrade to enforce the new rules.

==Reference implementation==
https://github.com/bitcoin/bitcoin/pull/6182

==See Also==
- [[bip-0112.mediawiki|BIP 112]]: CHECKSEQUENCEVERIFY