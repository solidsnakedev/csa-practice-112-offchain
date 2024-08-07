import {
  fromText,
  LucidEvolution,
  mintingPolicyToId,
  paymentCredentialOf,
  scriptFromNative,
} from "@lucid-evolution/lucid";

export type NFTMinterConfig = {
  lucid: LucidEvolution;
  TokenName: string;
  address: string;
};

export const NFTMinter = async (nftMinterConfig: NFTMinterConfig) => {
  const mkMintinPolicy = (address: string) => {
    return scriptFromNative({
      type: "all",
      scripts: [
        {
          type: "sig",
          keyHash: paymentCredentialOf(address).hash,
        },
      ],
    });
  };
  const nativeMint = mkMintinPolicy(nftMinterConfig.address);
  const nativePolicyId = mintingPolicyToId(nativeMint);

  const signBuilder = await nftMinterConfig.lucid
    .newTx()
    .pay.ToAddress(nftMinterConfig.address, {
      [nativePolicyId + fromText(nftMinterConfig.TokenName)]: 1n,
    })
    .mintAssets({
      [nativePolicyId + fromText(nftMinterConfig.TokenName)]: 1n,
    })
    .attach.MintingPolicy(nativeMint)
    .complete();

  const signed = await signBuilder.sign.withWallet().complete()
  const txHash = await signed.submit()
  return txHash
};
