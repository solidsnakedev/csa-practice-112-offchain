"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchLukeSkywalker = void 0;
console.log("hello");
console.log("test");
/**
 * How do we ensure that makeUser ALWAYS
 * returns a user?
 */
const makeUser = (id, firstName, lastName) => {
    return {
        id,
        firstName,
        lastName,
        role: "user",
        posts: [],
    };
};
const guitarists = new Set();
guitarists.add("Jimi Hendrix");
guitarists.add("Eric Clapton");
const createCache = () => {
    const cache = {};
    const add = (id, value) => {
        cache[id] = value;
    };
    const remove = (id) => {
        delete cache[id];
    };
    return {
        cache,
        add,
        remove,
    };
};
const cachevalue = createCache().add("1", "value1");
const fetchLukeSkywalker = async () => {
    const data = await fetch("https://swapi.dev/api/people/1");
    const jsonvalue = await data.json();
    // runtime type validation
    return jsonvalue;
};
exports.fetchLukeSkywalker = fetchLukeSkywalker;
