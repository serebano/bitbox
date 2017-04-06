import box from "../box";
import is from "../utils/is";
import Path from "../path";

import get from "./get";
import has from "./has";
import set from "./set";
import assign from "./assign";
import compute from "./compute";
import project from "./project";

export function proxy(fn) {
    return new Proxy(fn, {
        get(target, key) {
            return target.bind(undefined, key);
        }
    });
}

export { get, has, set, assign, compute, project };

export const toggle = path => is.path(path) ? set(path, value => !value) : set(value => !value);
export const inc = path => set(path, value => value + 1);
export const dec = path => set(path, value => value - 1);

export const or = value => function or(state) {
    return typeof state === "undefined" ? value : state;
};

export function eq(cond) {
    return state => state === cond;
}

export function gt(cond) {
    return state => state > cond;
}

export function lt(cond) {
    return state => state < cond;
}

export function type(arg) {
    return state => typeof state === arg;
}

export function ensure(key, value) {
    return obj => {
        if (obj && !(key in obj)) obj[key] = value;
        return obj[key];
    };
}

/**
 * state(on(key('count', eq(3)), count => console.log(`count === ${count}`)))
 * state(on(key('name', key('length', gt(10))), name => console.log(`name length > ${name.length}`)))
 */
// export const on = new Proxy(
//     function on(cond, fn) {
//         if (arguments.length === 1) {
//             fn = cond;
//             cond = arg => arg;
//         }
//         return obj => box(function on() {
//             const result = cond(obj);
//             result && fn.call(this, this.paths[0], result);
//         });
//     },
//     {
//         get($on, $key) {
//             return function on(cond, fn) {
//                 if (arguments.length === 1) return $on(key($key), cond);
//                 return $on(key($key, cond), fn);
//             };
//         }
//     }
// );

export function once(cond, fn) {
    return obj => box(function on() {
        const result = cond(obj);
        if (result) {
            const path = this.paths[0];
            this.unobserve();
            fn.call(this, path, result);
        }
    });
}

export function concat(path) {
    return (arr1 = []) => path((arr2 = []) => arr1.concat(arr2));
}

export function join(separator) {
    return array => array.join(separator);
}

export function map(fn) {
    return array => array.map(fn);
}

export function print(o, tab) {
    return JSON.stringify(o, null, tab || 4);
}
