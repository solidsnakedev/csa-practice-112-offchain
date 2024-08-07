import { Lucid, LucidEvolution } from "@lucid-evolution/lucid";
import { SimpleSaleDatum } from "../contract-schema.js";

export type WithdrawNFTConfig = {
  lucid: LucidEvolution;
};

export const withdrawNFT = (withdrawNFTConfig: WithdrawNFTConfig) => {
  const allContractUtxos = await withdrawNFTConfig.lucid.utxosAt(contractAddress);

  const allUserContractUtxos = allContractUtxos.filter((value) => {
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
