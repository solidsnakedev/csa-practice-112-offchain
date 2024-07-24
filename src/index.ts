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
