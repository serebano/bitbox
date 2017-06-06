import { getArgNames } from "../utils"

export const store = new Map()

export default function desc(fn, f, length) {
    const argNames = getArgNames(fn)
    console.log(`desc`, fn.name, f.name, length)
    if (f._isCurried) {
        f._isCurried = true
        f._name = fn.name
        f._args = f._args || fn._args || argNames
        f._index = length - fn.length
        f._rest = f._args.slice(f._index)

        f.toString = () => `function ${fn._name}( ${f._args.join(", ")} ) {}`
    }
    //console.log(`${f._name} [${f.length}:${length}]`, f._args)

    if (!store.has(fn)) store.set(fn, new Set())
    store.get(fn).add(f)

    return f
}
