export { default as assign } from "./assign";
export { default as project } from "./project";
export { default as compute } from "./compute";
export { default as on } from "./on";
export { default as resolve } from "./resolve";
export { default as push } from "./push";
export { default as signal } from "./signal";
export { default as template } from "./template";
export { default as observe } from "./observe";

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
    function eq(state) {
        return state === value;
    }
    eq.displayName = `eq(${value})`;
    return eq;
};

export const gt = value => {
    function gt(state) {
        return state > value;
    }

    gt.displayName = `gt(${value})`;

    return gt;
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

export const concat = value => {
    return function concat(state) {
        return state.concat(value);
    };
};

export const join = separator => {
    function join(array) {
        return array.join(separator);
    }
    join.displayName = `join(${separator})`;
    return join;
};

export const map = fn => {
    return function map(array) {
        return array.map(fn);
    };
};

export function print(object) {
    return JSON.stringify(object, null, 4);
}
