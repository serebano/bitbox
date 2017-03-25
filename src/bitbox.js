import { isObservable } from "./observer";
import Map from "./map";
import Compute from "./compute";
import path from "./path";
import * as Path from "./path";

export { default as is } from "./is";
export { default as bit } from "./bit";
export { default as box } from "./box";
export { default as run } from "./run";
export { default as path } from "./path";
export { default as proxy } from "./proxy";
export { default as observe } from "./observe";
export { default as component } from "./views/react";
import * as observer from "./observer";
export { observer };

export const github = Path.create((path, ...args) =>
    fetch(`https://api.github.com/${path.join("/")}`).then(res => res.json()));

export const state = Path.create((path, target, ...args) => Path.get(target, path, args), [
    `state`
]);

export const get = Path.create(function get(path, target, ...args) {
    if (!path.length) {
        path = target.path;
        target = undefined;

        return target => Path.get(target, path, args);
    }

    return Path.get(target, path, args);
});

export const set = Path.create(function set(path, target, ...args) {
    if (!path.length) {
        path = target.path;
        target = undefined;

        return target => {
            return Path.set(target, path, args);
        };
    }

    return Path.set(target, path, args);
});

export const has = Path.create((path, target) => Path.has(target, path));

export function compute(...args) {
    return new Compute(...args);
}
