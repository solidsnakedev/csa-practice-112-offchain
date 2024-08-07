import { Address, Data, Lucid, LucidEvolution, Validator, validatorToAddress } from "@lucid-evolution/lucid";
import { SimpleSaleDatum, MarketRedeemerEnum, AddressSchema, fromAddress } from "../contract-schema.js";

export type WithdrawNFTConfig = {
  lucid: LucidEvolution;
  marketplace: string;
 
};

export const withdrawNFT = async (withdrawNFTConfig: WithdrawNFTConfig) => {
  const allContractUtxos = await withdrawNFTConfig.lucid.utxosAt(withdrawNFTConfig.marketplace);

  //Question: is the purpose of this to find all utxos that may contain this datum?? and then are
  //          submitted to the validator using the collectFrom() function?  What if there are multiple
  //          utxos with a datum that matches the requirements?  Since the collectFrom() function takes
  //          an array of utxos why not just submit all the utxos and let the validator do what it is written
  //          to do which is pass or fail the transaction?
  const allUserContractUtxos = allContractUtxos.filter(async (value) => {
    if (value.datum) {
      try {
        const datum = Data.from(value.datum, SimpleSaleDatum);
        return datum.sellerAddress === fromAddress(await withdrawNFTConfig.lucid.wallet().address());
      } catch (_) {
        return false;
      }
    } else {
      return false;
    }
  });

  const contract: Validator = {
    type: "PlutusV2",
    script: withdrawNFTConfig.marketplace,
  };

  const redeemer = Data.to("Withdraw", MarketRedeemerEnum);
  const signBuilder =
    await
    withdrawNFTConfig.lucid
      .newTx()
      .collectFrom(allUserContractUtxos, redeemer)
      .attach.SpendingValidator(contract)
      .addSigner(await withdrawNFTConfig.lucid.wallet().address())
      .complete();

  const signed = await signBuilder.sign.withWallet().complete();
  const txHash = await signed.submit();
  return txHash

};
