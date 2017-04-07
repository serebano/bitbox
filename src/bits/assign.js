import { resolve } from "../bits";

/**
 * assign()
 * @param  {Array} args
 * @return {Object}
 *
 * state($assign, {name: 'bitbox'})
 * assign(state, {name: 'bitbox'})
 */

export function $assign(target, key, [args], obj) {
    if (!Reflect.has(target, key)) Reflect.set(target, key, {});

    const value = Object.assign(
        Reflect.get(target, key),
        ...args.map(arg => resolve(target, key, arg, obj))
    );

    return Reflect.set(target, key, value);
}

export default function assign(path, ...args) {
    return path($assign, args);
}
