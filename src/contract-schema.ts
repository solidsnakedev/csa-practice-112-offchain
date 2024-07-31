import { Data, fromText, toHex } from "@lucid-evolution/lucid";

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
  myVariableC: Data.Integer()
});
type MyObjectDatum = Data.Static<typeof MyObjectSchema>;
const MyObjectDatum = MyObjectSchema as unknown as MyObjectDatum; // empty value

const myObject: MyObjectDatum = {
  myVariableA: "313131",
  myVariableB: 5555n,
  myVariableC: 10n
};
const cbormyObject = Data.to(myObject, MyObjectDatum);
console.log(cbormyObject)

// 121_0([h'313131', 121_0([5555_1])]) -> cbor cddl standard
// Constr[0 ("313131", Constr[0, 5555])] -> plutus type

// 121_0([h'313131', 121_0([5555_1]), 10])

const myObject2: MyObjectDatum = {
  myVariableA: "313131",
  myVariableB: null,
  myVariableC: 10n
};
const cbormyObject2 = Data.to(myObject2,MyObjectDatum)

console.log(cbormyObject2)
// 121_0([h'313131', 122_0([]), 10])

console.log(Data.from("d8798343313131d87a800a", MyObjectDatum))

// pub type SimpleSale {
//   sellerAddress: Address,
//   priceOfAsset: Int,
// }

// pub type MarketRedeemer {
//   Buy
//   Withdraw
// }
