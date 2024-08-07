import {
  Data,
  LucidEvolution,
  Validator,
  validatorToAddress,
} from "@lucid-evolution/lucid";
import {
  fromAddress,
  SimpleSaleDatum,
} from "../contract-schema.js";

export type LockNFTConfig = {
  lucid: LucidEvolution;
  priceOfAsset: bigint;
  policyID: string;
  TokenName: string;
  marketPlace: string;
};

export const lockNFT = async (lockNFTConfig: LockNFTConfig) => {
  const datum = Data.to(
    {
      sellerAddress: fromAddress(await lockNFTConfig.lucid.wallet().address()),
      priceOfAsset: lockNFTConfig.priceOfAsset,
    },
    SimpleSaleDatum
  );
  const contract: Validator = {
    type: "PlutusV2",
    script: lockNFTConfig.marketPlace,
  };
  const contractAddr = validatorToAddress("Preprod", contract);

  //TODO:
  //build a the lockNFT transaction
  //- lock the nft in the contract output
  //- take use info , serialize into datum. datum must the lock at the contract output
  const tx = await lockNFTConfig.lucid
    .newTx()
    .pay.ToAddressWithData(
      contractAddr,
      {
        kind: "inline",
        value: datum,
      },
      { [lockNFTConfig.policyID + lockNFTConfig.TokenName]: 1n }
    )
    .complete();

  const signed = await tx.sign.withWallet().complete();

  const submit = await signed.submit();
  return submit
};