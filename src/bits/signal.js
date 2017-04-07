import run from "../run";

export default function signal(name, chain) {
    if (arguments.length === 1) return props => run(name, props);

    return props => run(name, chain, props);
}

export function $signal(target, key, [name, chain]) {
    return Reflect.set(target, key, props => run(name, chain, props));
}

export const s = (path, chain, obj) => path($signal, String(path), chain, obj);
