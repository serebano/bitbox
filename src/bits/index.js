export { default as get } from "./get";
export { default as has } from "./has";
export { default as set } from "./set";
export { default as assign } from "./assign";
export { default as project } from "./project";
export { default as compute } from "./compute";
export { default as on } from "./on";

/**
 * Getters
 */

export function inc(number) {
    return number + 1;
}

export function dec(number) {
    return number - 1;
}

export function toggle(value) {
    return !value;
}

export const or = value => {
    return function or(state) {
        return typeof state === "undefined" ? value : state;
    };
};

export const eq = value => {
    return function eq(state) {
        return state === value;
    };
};

export const gt = value => {
    return function gt(state) {
        return state > value;
    };
};

export const lt = value => {
    return function lt(state) {
        return state < value;
    };
};

export const type = value => {
    return function type(state) {
        return typeof state === value;
    };
};

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
