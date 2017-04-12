import { resolve } from ".";

export function $push(target, key, args, obj) {
    const array = Reflect.get(target, key);
    array.push(...args.map(arg => resolve(target, key, arg, obj)));

    return true;
}

export default function push(path, ...args) {
    return path($push, ...args);
}
