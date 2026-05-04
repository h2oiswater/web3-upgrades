BIP: 16
Layer: Consensus (soft fork)
Title: Pay to Script Hash
Authors: Gavin Andresen
Status: Deployed
Type: Specification
Assigned: 2012-01-03

==Abstract==

This BIP describes a new "standard" transaction type for the Bitcoin scripting system, and defines additional validation rules that apply only to the new transactions.

==Motivation==

The purpose of pay-to-script-hash is to move the responsibility for supplying the conditions to redeem a transaction from the sender of the funds to the redeemer.

The benefit is allowing a sender to fund any arbitrary transaction, no matter how complicated, using a fixed-length 20-byte hash that is short enough to scan from a QR code or easily copied and pasted.

==Specification==

This BIP defines a new standard transaction type that is relayed and included in mined blocks, but data items smaller than 520 bytes are still pushed to the stack.

A new standard transaction type that is relayed and included in mined blocks:
  OP_HASH160 <20-byte hash> OP_EQUAL

Validation fails if there are any operations other than "push data" operations in the scriptSig.

Normal validation is then performed: the initial stack is empty, if the redeem script is a standard Pay-to-pubkey-hash scriptPubKey, validation of the scriptSig is exactly the same as for a Pay-to-pubkey-hash transaction.

==Rationale==

This BIP replaces BIP 12, which proposed a new Script opcode ("OP_EVAL") to accomplish exactly this.

==Compatibility==

This is a soft fork. All the old rules remain in place, the only changes being the new standard transaction type and a ban on transactions that contain invalid push operations in their scriptSig.

==Reference Implementation==
https://github.com/bitcoin/bitcoin/commit/6b973e8e39db7b517f3572214a42449562138c22

==See Also==
- [[bip-0012.mediawiki|BIP 0012]]
- The Power of Scripting by Gavin Andresen

==Copyright==
Public domain.