import { Address, Data, getAddressDetails } from "@lucid-evolution/lucid";

const Blake2b_224Schema = Data.Bytes({ minLength: 28, maxLength: 28 });

export const CredentialSchema = Data.Enum([
  Data.Object({
    PublicKeyCredential: Data.Tuple([Blake2b_224Schema]),
  }),
  Data.Object({
    ScriptCredential: Data.Tuple([
      Data.Bytes({ minLength: 28, maxLength: 28 }),
    ]),
  }),
]);
export type Credential = Data.Static<typeof CredentialSchema>;
export const Credential = CredentialSchema as unknown as Credential;

const PointerSchema = Data.Object({
  Pointer: Data.Tuple([
    Data.Object({
      slotNumber: Data.Integer(),
      transactionIndex: Data.Integer(),
      certificateIndex: Data.Integer(),
    }),
  ]),
});
const InlineSchema = Data.Object({ Inline: Data.Tuple([CredentialSchema]) });

const AddressSchema = Data.Object({
  paymentCredential: CredentialSchema,
  stakeCredential: Data.Nullable(Data.Enum([InlineSchema, PointerSchema])),
});

type AddressObject = Data.Static<typeof AddressSchema>;
const AddressObject = AddressSchema as unknown as AddressObject;

const MarketRedeemerEnumSchema = Data.Enum([
  Data.Literal("Buy"),
  Data.Literal("Withdraw"),
]);

type MarketRedeemerEnum = Data.Static<typeof MarketRedeemerEnumSchema>;
const MarketRedeemerEnum =
  MarketRedeemerEnumSchema as unknown as MarketRedeemerEnum;

//-- Datum schema
const SimpleSaleSchema = Data.Object({
  sellerAddress: AddressSchema,
  priceOfAsset: Data.Integer(),
});

export type SimpleSaleDatum = Data.Static<typeof SimpleSaleSchema>;
export const SimpleSaleDatum = SimpleSaleSchema as unknown as SimpleSaleDatum;

export function fromAddress(address: Address): AddressObject {
  const { paymentCredential, stakeCredential } = getAddressDetails(address);

  if (!paymentCredential) throw new Error("Not a valid payment address.");

  return {
    paymentCredential:
      paymentCredential?.type === "Key"
        ? {
            PublicKeyCredential: [paymentCredential.hash],
          }
        : { ScriptCredential: [paymentCredential.hash] },
    stakeCredential: stakeCredential
      ? {
          Inline: [
            stakeCredential.type === "Key"
              ? {
                  PublicKeyCredential: [stakeCredential.hash],
                }
              : { ScriptCredential: [stakeCredential.hash] },
          ],
        }
      : null,
  };
}
