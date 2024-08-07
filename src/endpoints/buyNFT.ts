import { Address, Data, Lucid, LucidEvolution, Validator } from "@lucid-evolution/lucid";
import { SimpleSaleDatum, MarketRedeemerEnum, fromAddress } from "../contract-schema.js";

export type BuyNFTConfig = {
  lucid: LucidEvolution;
  marketplace: string;
  owner_pkh: string;
  priceOfAsset: bigint;
};

export const withdrawNFT = async (buyNFTConfig: BuyNFTConfig) => {
  const allContractUtxos = await buyNFTConfig.lucid.utxosAt(buyNFTConfig.marketplace);

  const allUserContractUtxos = allContractUtxos.filter(async (value) => {
    if (value.datum) {
      try {
        const datum = Data.from(value.datum, SimpleSaleDatum);
        const price_equal =  datum.priceOfAsset = buyNFTConfig.priceOfAsset;
        const same_addr = datum.sellerAddress === fromAddress(await buyNFTConfig.lucid.wallet().address());
        return price_equal && same_addr
      } catch (_) {
        return false;
      }
    } else {
      return false;
    }
  });

  const contract: Validator = {
    type: "PlutusV2",
    script: buyNFTConfig.marketplace,
  };


  const redeemer = Data.to("Withdraw", MarketRedeemerEnum);
  const signBuilder =
    await
    buyNFTConfig.lucid
      .newTx()
      .collectFrom(allUserContractUtxos, redeemer)
      .attach.SpendingValidator(contract)
      .complete();

  const signed = await signBuilder.sign.withWallet().complete();
  const txHash = await signed.submit();
  return txHash

};
