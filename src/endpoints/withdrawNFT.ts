import { Address, Data, Lucid, LucidEvolution } from "@lucid-evolution/lucid";
import { SimpleSaleDatum, MarketRedeemerEnum } from "../contract-schema.js";

export type WithdrawNFTConfig = {
  lucid: LucidEvolution;
  marketplace: string;
  owner_pkh: string;
};

export const withdrawNFT = async (withdrawNFTConfig: WithdrawNFTConfig) => {
  const allContractUtxos = await withdrawNFTConfig.lucid.utxosAt(withdrawNFTConfig.marketplace);


  const allUserContractUtxos = allContractUtxos.filter((value) => {
    if (value.datum) {
      try {
        const datum = Data.from(value.datum, SimpleSaleDatum);
        return datum.sellerAddress === withdrawNFTConfig.lucid.wallet().address();
      } catch (_) {
        return false;
      }
    } else {
      return false;
    }
  });

  const redeemer = Data.to("Withdraw", MarketRedeemerEnum);
  const signBuilder =
    await
    withdrawNFTConfig.lucid
      .newTx()
      .collectFrom(allUserContractUtxos, redeemer)
      .attach.SpendingValidator(withdrawNFTConfig.marketplace)
      .addSigner(datum.sellerAddress)
      .complete();
      
  const signed = await signBuilder.sign.withWallet().complete();
  const txHash = await signed.submit();
  return txHash

};
