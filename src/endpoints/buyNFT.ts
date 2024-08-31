import { Address, Data, Lucid, LucidEvolution, UTxO, Validator } from "@lucid-evolution/lucid";
import { SimpleSaleDatum, MarketRedeemerEnum, fromAddress } from "../contract-schema.js";

export type BuyNFTConfig = {
  lucid: LucidEvolution;
  marketplace: string;
  utxo: UTxO,
  sellerAddr: Address
};


export const buyNFT = async (buyNFTConfig: BuyNFTConfig) => {

  const contract: Validator = {
    type: "PlutusV2",
    script: buyNFTConfig.marketplace,
  };

  const redeemer = Data.to("Buy", MarketRedeemerEnum);
  const signBuilder =
    await
    buyNFTConfig.lucid
      .newTx()
      .pay.ToAddress(buyNFTConfig.sellerAddr, {lovelace: 10_000_000n})
      .collectFrom([buyNFTConfig.utxo], redeemer)
      .attach.SpendingValidator(contract)
      .complete();

  const signed = await signBuilder.sign.withWallet().complete();
  const txHash = await signed.submit();
  return txHash;
};
