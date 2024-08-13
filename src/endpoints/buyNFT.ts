import { Address, Data, Lucid, LucidEvolution, UTxO, Validator } from "@lucid-evolution/lucid";
import { SimpleSaleDatum, MarketRedeemerEnum, fromAddress } from "../contract-schema.js";



export type BuyNFTConfig = {
  lucid: LucidEvolution;
  marketplace: string;
  // priceOfAsset: bigint;
  utxo: UTxO
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
      .collectFrom([buyNFTConfig.utxo], redeemer)
      .attach.SpendingValidator(contract)
      .complete();

  const signed = await signBuilder.sign.withWallet().complete();
  const txHash = await signed.submit();
  return txHash

};

// Aiken
// type MarketRedeemer = Buy | Withdraw
// type Buy = {index : Int}
// type Withdraw = {index: Int}
// validator {fn stakeValidator(Redeemer, ScriptContext) -> Bool {
//     expect VerificationKeyCredential(seller_pkh) =
//       dat.sellerAddress.payment_credential

//     when action is {
//       Buy -> buy_function(ctx, dat.priceOfAsset, dat.sellerAddress)
//       Withdraw -> must_be_signed_by(ctx.transaction, seller_pkh)
//     }
//   }

// }}
// // validator (stake_credential) {
//   fn mkmarket(
//     dat: SimpleSale,
//     action: MarketRedeemer,
//     ctx: ScriptContext,
//   ) -> Bool {
// check if withdaw stake is present
// check(stake_credential, transaction.withdrawals)
// }
