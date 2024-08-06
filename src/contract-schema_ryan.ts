import { Data, fromText, toHex, Address } from "@lucid-evolution/lucid";


// ********************************************************
// *****  Market Redeemer type from NFT market place *****
// ********************************************************

//****** easy way - less readable IMO ****************/
// const MarketRedeemerSchema = Data.Object({
//   BuyOrWithdraw: Data.Integer()
// });

const MarketRedeemerEnum = Data.Enum([
  Data.Literal("Buy"),
  Data.Literal("Withdraw")
]);

const MarketRedeemerSchema = Data.Object({
  BuyOrWithdraw: MarketRedeemerEnum
});

type RedeemerOject = Data.Static<typeof MarketRedeemerSchema>;
const RedeemerOject = MarketRedeemerSchema as unknown as RedeemerOject;

const myRedeemer: RedeemerOject = {
  BuyOrWithdraw: "Buy"
};

console.log(Data.to(myRedeemer,RedeemerOject));

//throws error
//console.log(Data.from("d87981d87980",RedeemerOject));



// ********************************************************
// *****  SimpleSale datum type from NFT market place *****
// ********************************************************
const CredentialSchema = Data.Enum([
  Data.Object({ VKeyCredential: Data.Object({bytes: Data.Bytes(),}),}),
  Data.Object({ StakeCredential: Data.Object({bytes: Data.Bytes(),}),})
]);

const AddressSchema = Data.Object({
  paymentCredential: CredentialSchema,
  stakeCredential: Data.Nullable(CredentialSchema) // ==  maybe CredentialSchema
});

type AddressObject = Data.Static<typeof AddressSchema>;
const AddressObject = CredentialSchema as unknown as AddressObject;


const SimpleSaleSchema = Data.Object({
    sellerAddress: AddressSchema,
    priceOfAsset: Data.Integer()
});

type SimpleSaleDatum = Data.Static<typeof SimpleSaleSchema>;
const SimpleSaleDatum = SimpleSaleSchema as  unknown as SimpleSaleDatum;

const myuSimpleSaleDatum: SimpleSaleDatum = {
  sellerAddress:{
    paymentCredential: {
      VKeyCredential: {bytes: "1235"}
    },
    stakeCredential: null
  },
  priceOfAsset: 100n
};


const mySimpleSaleObject = Data.to(myuSimpleSaleDatum,SimpleSaleDatum);
console.log(mySimpleSaleObject);

// !!!!!!!!!!!!!!111 throws and error!
// console.log(Data.from("d8798343313131d879811915b30a",SimpleSaleDatum));




