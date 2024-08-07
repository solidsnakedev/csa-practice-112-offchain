import {
  Address,
  Constr,
  Data,
  fromText,
  getAddressDetails,
  toHex,
} from "@lucid-evolution/lucid";

const MyDatumSchema = Data.Integer();
type MyDatum = Data.Static<typeof MyDatumSchema>;
const MyDatum = MyDatumSchema as unknown as MyDatum;

const datum: MyDatum = 1234n;
const cbordatum = Data.to(datum, MyDatum);
console.log(cbordatum);

const decodedDatum = Data.from(cbordatum, MyDatum);

console.log(decodedDatum);

const MyByteArraySchema = Data.Bytes();
type MyByteArray = Data.Static<typeof MyByteArraySchema>;
const MyByteArray = MyByteArraySchema as unknown as MyByteArray;

const datumByteArray: MyByteArray = fromText("hello_world"); //hex

const cborByteArray = Data.to(datumByteArray, MyByteArray);
console.log(cborByteArray);

const MyObjectSchema = Data.Object({
  myVariableA: Data.Bytes(),
  myVariableB: Data.Nullable(Data.Integer()),
  myVariableC: Data.Integer(),
});
type MyObjectDatum = Data.Static<typeof MyObjectSchema>;
const MyObjectDatum = MyObjectSchema as unknown as MyObjectDatum; // empty value

const myObject: MyObjectDatum = {
  myVariableA: "313131",
  myVariableB: 5555n,
  myVariableC: 10n,
};
const cbormyObject = Data.to(myObject, MyObjectDatum);
console.log(cbormyObject);

// 121_0([h'313131', 121_0([5555_1])]) -> cbor cddl standard
// Constr[0 ("313131", Constr[0, 5555])] -> plutus type

// 121_0([h'313131', 121_0([5555_1]), 10])

const myObject2: MyObjectDatum = {
  myVariableA: "313131",
  myVariableB: null,
  myVariableC: 10n,
};
const cbormyObject2 = Data.to(myObject2, MyObjectDatum);

console.log(cbormyObject2);
// 121_0([h'313131', 122_0([]), 10])

console.log(Data.from("d8798343313131d87a800a", MyObjectDatum));

// pub type SimpleSale {
//   sellerAddress: Address,
//   priceOfAsset: Int,
// }

// pub type MarketRedeemer {
//   Buy
//   Withdraw
// }

// Credential
// Constructors
// VerificationKeyCredential(Hash<Blake2b_224, VerificationKey>)
// ScriptCredential(Hash<Blake2b_224, Script>)

// Sha256 32
// Blake2b_224 28 bytes
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

// Address {
//   payment_credential: PaymentCredential,
//   stake_credential: Option<StakeCredential>,
// }

// StakeCredential = Referenced<Credential>
// Referenced<a>
// Constructors
// Inline(a)
// Pointer { slot_number: Int, transaction_index: Int, certificate_index: Int }

// StakeCredential =
//   Inline(Credential)
//   Pointer { slot_number: Int, transaction_index: Int, certificate_index: Int }

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

export const AddressSchema = Data.Object({
  paymentCredential: CredentialSchema,
  stakeCredential: Data.Nullable(Data.Enum([InlineSchema, PointerSchema])),
});

type AddressObject = Data.Static<typeof AddressSchema>;
const AddressObject = AddressSchema as unknown as AddressObject;

// bech32 into data

export function fromAddress(address: Address): AddressObject {
  // We do not support pointer addresses!

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
console.log(
  "fromAddress",
  JSON.stringify(
    fromAddress(
      "addr_test1qzqaf0vrfgp6rjexculvz95uh5wfwf80scuzk0pkhk0uwhtyf3p6v74w39symppcqpsnfl8g883x4gh0mmlg5lua7e0qw5w84m"
    )
  )
);

//bech32
export const myAddr =
  "addr_test1qzqaf0vrfgp6rjexculvz95uh5wfwf80scuzk0pkhk0uwhtyf3p6v74w39symppcqpsnfl8g883x4gh0mmlg5lua7e0qw5w84m";

// Plutus or Aiken
// ByteString  haskell
// Bytearray Aiken
// hexadecimal
// UInt8Array
// const a : AddressObject = {
//   paymentCredential: {
//     PublicKeyCredential: [
//       "12345", // bytes -> hex , [bytearray]
//     ],
//   },
//   stakeCredential: {
//     Inline: [
//       {
//         PublicKeyCredential: [
//           "64 4c 43 a6 7a ae 89 60 4d 84 38 00 61 34 fc e8 39 e2 6a a2 ef de fe 8a 7f 9d f6 5e",
//         ],
//       },
//     ],
//   },
// };
const a: AddressObject = {
  paymentCredential: {
    PublicKeyCredential: [
      "81d4bd834a03a1cb26c73ec1169cbd1c9724ef86382b3c36bd9fc75d",
    ],
  },
  stakeCredential: {
    Inline: [
      {
        PublicKeyCredential: [
          "644c43a67aae89604d8438006134fce839e26aa2efdefe8a7f9df65e",
        ],
      },
    ],
  },
};

// CDDL CBOR
// 121_0([
//   121_0([
//       h'81d4bd834a03a1cb26c73ec1169cbd1c9724ef86382b3c36bd9fc75d',
//   ]),
//   121_0([
//       121_0([
//           121_0([
//               h'644c43a67aae89604d8438006134fce839e26aa2efdefe8a7f9df65e',
//           ]),
//       ]),
//   ]),
// ])

console.log("address cbor:", Data.to(fromAddress(myAddr), AddressObject));

// pub type SimpleSale {
//   sellerAddress: Address,
//   priceOfAsset: Int,
// }


// Aiken
// type Datum {
//   owner: Hash<Blake2b_224, VerificationKey>,
// }

// CIP57 , blueprint
// "hello/Datum": {
//   "title": "Datum",
//   "anyOf": [
//     {
//       "title": "Datum",
//       "dataType": "constructor",
//       "index": 0,
//       "fields": [
//         {
//           "title": "owner",
//           "$ref": "#/definitions/ByteArray"
//         }
//       ]
//     }
//   ]
// },

const helloDatum = new Constr(0, [""]);
const helloCbor = Data.to(helloDatum);
const helloObject = Data.Object({
  owner: Data.Bytes({ minLength: 28, maxLength: 28 }),
});

// -------------
// Redeemer schema
const MarketRedeemerEnumSchema = Data.Enum([
  Data.Literal("Buy"),
  Data.Literal("Withdraw"),
]);

type MarketRedeemerEnum = Data.Static<typeof MarketRedeemerEnumSchema>;
export const MarketRedeemerEnum =
  MarketRedeemerEnumSchema as unknown as MarketRedeemerEnum;

//-- Datum schema
const SimpleSaleSchema = Data.Object({
  sellerAddress: AddressSchema,
  priceOfAsset: Data.Integer(),
});

export type SimpleSaleDatum = Data.Static<typeof SimpleSaleSchema>;
export const SimpleSaleDatum = SimpleSaleSchema as unknown as SimpleSaleDatum;



// --- example
export const simplesale: SimpleSaleDatum = {
  sellerAddress: fromAddress(myAddr),
  priceOfAsset: 10_000_000n,
};
export const simplesaleCbor: string = Data.to(simplesale, SimpleSaleDatum);
console.log("simplesaleCbor: ", simplesaleCbor);

export const stringify = (data: any) =>
  JSON.stringify(
    data,
    (key, value) =>
      typeof value === "bigint" ? value.toString() + "n" : value,
    2
  );

const rawSimpleSaleCbor =
  "d87982d87982d87981581c81d4bd834a03a1cb26c73ec1169cbd1c9724ef86382b3c36bd9fc75dd87981d87981d87981581c644c43a67aae89604d8438006134fce839e26aa2efdefe8a7f9df65e0a";

console.log(
  "readable datum: ",
  stringify(Data.from(rawSimpleSaleCbor, SimpleSaleDatum))
);
