import { Lucid, LucidEvolution } from "@lucid-evolution/lucid";
import { SimpleSaleDatum } from "../contract-schema.js";

export type WithdrawNFTConfig = {
  lucid: LucidEvolution;
};

export const withdrawNFT = (withdrawNFTConfig: WithdrawNFTConfig) => {
  const allContractUtxos = await withdrawNFTConfig.lucid.utxosAt(contractAddress);

  //Question: is the purpose of this to find all utxos that may contain this datum?? and then are
  //          submitted to the validator using the collectFrom() function?  What if there are multiple
  //          utxos with a datum that matches the requirements?  Since the collectFrom() function takes
  //          an array of utxos why not just submit all the utxos and let the validator do what it is written
  //          to do which is pass or fail the transaction?
  // what if? utxo != SimpleSaleDatum
  // aiken validator will fail
  const allUserContractUtxos = allContractUtxos.filter(async (value) => {
    if (value.datum) {
      try {
        const datum = Data.from(value.datum, SimpleSaleDatum);
        return datum.owner === publicKeyHash;
      } catch (_) {
        return false;
      }
    } else {
      return false;
    }
  });

  const redeemer = Data.to("", MarketRedeemerEnum)
  const signBuilder =
    await
    withdrawNFTConfig.lucid
      .newTx()
      .collectFrom(allUserContractUtxos, redeemer)
      .attach.SpendingValidator(nftcontract)
      .addSigner(addr)
      .complete();
  const signed = signBuilder.sign.complete()
  const txHash = signed.submit()
  return txHash

};
