import box from "./box";

export function or(value) {
    return state => typeof state === "undefined" ? value : state;
}

export function eq(cond) {
    return state => state === cond;
}

export function is(arg) {
    return state => typeof state === arg;
}

export function ensure(key, value) {
    return state => {
        if (state && !(key in state)) state[key] = value;
        return state[key];
    };
}

export function on(fn) {
    return o => box(fn, o);
}

export function concat(path) {
    return (arr1 = []) => path((arr2 = []) => arr1.concat(arr2));
}
