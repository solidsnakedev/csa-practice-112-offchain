import { LucidEvolution } from "@lucid-evolution/lucid"

export type LockNFTConfig = {
  lucid: LucidEvolution
}


export const lockNFT = (lockNFTConfig: LockNFTConfig) => {

  //TODO:
  //build a the lockNFT transaction
  //- lock the nft in the contract output
  //- take use info , serialize into datum. datum must the lock at the contract output
  const tx = lockNFTConfig.lucid.newTx().pay.ToAddressWithData(...).complete()

}