import { generateSeedPhrase, Koios, Lucid } from "@lucid-evolution/lucid";
import * as CML from "@anastasia-labs/cardano-multiplatform-lib-nodejs"

console.log("hello");

console.log("test");

// export const addTwoNumbers = (a: number, b: number): number => {
//   return a + b;
// };

// export const addTwoNumbers = (params: { first: number; second: number }) => {
//   return params.first + params.second;
// };

// type AddTwoNumbers = {
//   first: number;
//   second: number;
// };

// export const addTwoNumbers = (params: AddTwoNumbers) => {
//   return params.first + params.second;
// };

// type FirstLast = {
//   first: string;
//   last?: string;
// };

// export const getName = (params: FirstLast) => {
//   if (params.last) {
//     return `${params.first} ${params.last}`;
//   }
//   return params.first;
// };

// const name1 = getName({ first: "sds", last: "asdad" });
// const name2 = getName({ first: "sds" });

// type User = {
//   id: number;
//   firstName: string;
//   lastName: string;
//   /**
//    * How do we ensure that role is only one of:
//    * - 'admin'
//    * - 'user'
//    * - 'super-admin'
//    */
//   role: "admin" | "user" | "super-admin";
// };

// export const defaultUser: User = {
//   id: 1,
//   firstName: "Matt",
//   lastName: "Pocock",
//   role: "admin",
// };

// type User = {
//   id: number;
//   firstName: string;
//   lastName: string;
//   /**
//    * How do we ensure that role is only one of:
//    * - 'admin'
//    * - 'user'
//    * - 'super-admin'
//    */
//   role: "admin" | "user" | "super-admin";
//   posts: Post[]
// };

// type Post = {
//   id: number;
//   title: string;
// }

// export const defaultUser: User = {
//   id: 1,
//   firstName: "Matt",
//   lastName: "Pocock",
//   role: "admin",
//   posts: [
//     {
//       id: 1,
//       title: "How I eat so much cheese",
//     },
//     {
//       id: 2,
//       title: "Why I don't eat more vegetables",
//     },
//   ],
// };

type User = {
  id: number;
  firstName: string;
  lastName: string;
  role: "admin" | "user" | "super-admin";
  posts: Array<Post>;
};

type Post = {
  id: number;
  title: string;
};

/**
 * How do we ensure that makeUser ALWAYS
 * returns a user?
 */
const makeUser = (id: number, firstName: string, lastName: string): User => {
  return {
    id,
    firstName,
    lastName,
    role: "user",
    posts: [],
  };
};

const guitarists = new Set<string>();

guitarists.add("Jimi Hendrix");
guitarists.add("Eric Clapton");

const createCache = () => {
  const cache: Record<string, string> = {};

  const add = (id: string, value: string) => {
    cache[id] = value;
  };

  const remove = (id: string) => {
    delete cache[id];
  };

  return {
    cache,
    add,
    remove,
  };
};

const cachevalue = createCache().add("1", "value1");

interface LukeSkywalker {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
}

export const fetchLukeSkywalker = async (): Promise<LukeSkywalker> => {
  const data = await fetch("https://swapi.dev/api/people/1");
  const jsonvalue = await data.json();
  // runtime type validation - effect.schema - zod - typebox
  return jsonvalue;
};

const user1 = await Lucid(
  new Koios("https://preprod.koios.rest/api/v1"),
  "Preprod"
);

user1.selectWallet.fromSeed(
  "mule quit evil loyal hamster finish plastic tattoo walk grace above bring swing fiction cook corn unusual coral decade poverty lake state lift shrug"
);

//bech32
console.log(await user1.wallet().address());

console.log(await user1.wallet().getUtxos());

const user2 = await Lucid(
  new Koios("https://preprod.koios.rest/api/v1"),
  "Preprod"
);
user2.selectWallet.fromSeed(
  "salad word urban spoil love crawl talk fall lady early equal become delay hour sphere cupboard envelope dog real comfort middle resemble forward response"
);
console.log("user2: ", await user2.wallet().address());

const tx = await user1
  .newTx()
  .pay.ToAddress(
    "addr_test1qzqaf0vrfgp6rjexculvz95uh5wfwf80scuzk0pkhk0uwhtyf3p6v74w39symppcqpsnfl8g883x4gh0mmlg5lua7e0qw5w84m",
    { lovelace: 5_000_000n }
  )
  .complete()

const signed = await tx.sign.withWallet().complete();

// const txhash = await signed.submit();
// console.log(txhash);
console.log("hash", signed.toHash())
console.log("cbor", signed.toCBOR())
console.log("txbody()", CML.Transaction.from_cbor_hex(signed.toCBOR()).body().to_json()) 
console.log("witness()", CML.Transaction.from_cbor_hex(signed.toCBOR()).witness_set().to_json())

// transaction =
//   [ transaction_body
//   , transaction_witness_set
//   , bool
//   , auxiliary_data / null
//   ] 

// transaction_input = [ transaction_id : $hash32
//   , index : uint .size 2
//   ]
// transaction_body =
//   { 0 : set<transaction_input>             ; inputs
//   , 1 : [* transaction_output]
//   , 2 : coin                               ; fee
//   , ? 3 : slot_no                          ; time to live
//   , ? 4 : certificates
//   , ? 5 : withdrawals
//   , ? 7 : auxiliary_data_hash
//   , ? 8 : slot_no                          ; validity interval start
//   , ? 9 : mint
//   , ? 11 : script_data_hash
//   , ? 13 : nonempty_set<transaction_input> ; collateral inputs
//   , ? 14 : required_signers
//   , ? 15 : network_id
//   , ? 16 : transaction_output              ; collateral return
//   , ? 17 : coin                            ; total collateral
//   , ? 18 : nonempty_set<transaction_input> ; reference inputs
//   , ? 19 : voting_procedures               ; New; Voting procedures
//   , ? 20 : proposal_procedures             ; New; Proposal procedures
//   , ? 21 : coin                            ; New; current treasury value
//   , ? 22 : positive_coin                   ; New; donation
//   }

//   transaction_witness_set =
//   { ? 0: nonempty_set<vkeywitness> // wallet
//   , ? 1: nonempty_set<native_script>
//   , ? 2: nonempty_set<bootstrap_witness> // byron
//   , ? 3: nonempty_set<plutus_v1_script>
//   , ? 4: nonempty_set<plutus_data> // datum_hash v1
//   , ? 5: redeemers // list of redeemers
//   , ? 6: nonempty_set<plutus_v2_script>
//   , ? 7: nonempty_set<plutus_v3_script>
//   }

//   vkeywitness = [ $vkey, $signature ]

// [
//   {
//       0: [
//           [
//               h'805a8eea5c8e37875d05c82e1f360fa47572190486effc149a56d383ab828648',
//               1,
//           ],
//       ],
//       1: [
//           [
//               h'0081d4bd834a03a1cb26c73ec1169cbd1c9724ef86382b3c36bd9fc75d644c43a67aae89604d8438006134fce839e26aa2efdefe8a7f9df65e',
//               5000000_2,
//           ],
//           [
//               h'00ac28744693abc3bda6286a736b5e646f45049367503c8111c6bd324b937778b28a571bfdcb67099fd9e62edf75e019d7d2c7cde5786d8ef3',
//               9663894_2,
//           ],
//       ],
//       2: 168053_2,
//   },
//   {
//       0: [
//           [
//               h'afe2655f36fe02e4d930c0046ac22b3d7191a219729f4505d9a9f7ada3da9864',
//               h'4e4615df3c0c60f2ee5b9e537b1ccd2303f5f558d3d6eb1fecc1d2af8d5d881899d41d8af9b2f2769d46c54e37da87db3ae993276d00a69b0866c8516dd34302',
//           ],
//       ],
//   },
//   true,
//   null,
// ]



