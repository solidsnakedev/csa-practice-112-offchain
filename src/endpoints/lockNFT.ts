import { Blockfrost, Data, fromText, Lucid, LucidEvolution, Validator, validatorToAddress  } from "@lucid-evolution/lucid"
import { myAddr, simplesale, simplesaleCbor } from "../contract-schema.js"


export type LockNFTConfig = {
  lucid: LucidEvolution
}


const API_KEY : string = "123434213321"

export const lockNFT = async (lockNFTConfig: LockNFTConfig) => {

  //TODO:
  //build a the lockNFT transaction
  //- lock the nft in the contract output
  //- take use info , serialize into datum. datum must the lock at the contract output
  const tx = await lockNFTConfig.lucid
    .newTx()
    .pay.ToAddressWithData(
      myAddr, 
      { 
        kind: "inline", 
        value: simplesaleCbor,
      },
       {lovelace: 20_000_000n,["test_pid" + fromText("test nft")]: 1n }
      )
      .complete();

  const signed = await tx.sign.withWallet().complete();

  const submit = await signed.submit();

}

//********************************************** */
// *****  my own function **********************/
//************************************************* */
export const lockNFT_ryan = async () => {
  //create user from blockfrost provider
  const user1 = await Lucid(
    new Blockfrost(
      "https://cardano-preprod.blockfrost.io/api/v0",
      API_KEY,
    ),
    "Preprod"
  );

  user1.selectWallet.fromSeed("mule quit evil loyal hamster finish plastic tattoo walk grace above bring swing fiction cook corn unusual coral decade poverty lake state lift shrug");

  //magically create address for contract... not exactly sure how to implement this
  //usually in the CDP course I would create the address in aiken or plutus and paste in CLI  
  const contract: Validator = {
    type: "PlutusV2",
    script: "some_random_cbor_for_a_contract"
  }
  const contractAddr = validatorToAddress("Preprod",contract);

  //create transaction, sign, and submit
  const tx = await user1
    .newTx()
    .pay.ToAddressWithData(
      contractAddr, 
      { 
        kind: "inline", 
        value: simplesaleCbor,
      },
       {lovelace: 20_000_000n, ["test_pid" + fromText("test nft")]: 1n } //loveace + nft
      )
      .validFrom(Date.now())
      .complete();

  const signed = await tx.sign.withWallet().complete();

  const submit = await signed.submit();
}


//Question 1: when using the CLI we had to specify the utxo it the nft.  Does lucid magically find the correct utxo in the 
//          address and sends?
// Question 2: do you have to include ada with an nft?  I noticed in anastasia labs example there was not ada attached to a 
//          transaction with a nft.