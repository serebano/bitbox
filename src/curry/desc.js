import { getArgNames, toCamelCase } from "../utils"
import is from "../is"

export const store = new Map()

const toDisplayName = (f, received) =>
    (f.displayName =
        f._name +
        "(" +
        received
            .filter(v => !is.placeholder(v))
            .map(
                (val, idx) => (is.placeholder(val) ? "" : is.func(val) && val.displayName ? val.displayName : `${val}`)
            )
            .join(", ") +
        ")")

function desc(fn, f, received = [], length, left) {
    //if (!f._isCurried) {
    f._isCurried = true

    f._name = fn.name
    f._receivedArgs = received
    f._argNames = fn._argNames || getArgNames(fn)
    f._receivedNames = f._argNames.filter((arg, idx) => is.placeholder(received[idx]) || idx >= received.length)
    f.displayName = toDisplayName(f, received)

    Object.defineProperty(f, "args", {
        get: () =>
            received.filter(v => !is.placeholder(v)).reduce((obj, value, idx) => {
                const key = !is.undefined(f._argNames[idx]) ? f._argNames[idx] : idx
                obj[key] = value
                return obj
            }, {})
    })

    f.toString = () => `function ${f.displayName}( ${f._receivedNames.join(", ")} ) {}`

    const map = received.map((val, idx) => `${idx} [${f._argNames[idx]}] = ${is.placeholder(val) ? "__" : val}`)
    console.log(`${f._name}(`, map.join(", "), `) -> ( ${f._receivedNames.join(", ")} )`)
    //}

    if (!store.has(fn)) store.set(fn, new Set())
    store.get(fn).add(f)

    return f
}

export default desc
