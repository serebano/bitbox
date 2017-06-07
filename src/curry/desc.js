import { getArgNames, toCamelCase, toDisplayName } from "../utils"
import is from "../is"

export const store = new Map()

export const getReceivedNames = (_argNames, received) =>
    received.filter((arg, idx) => !is.placeholder(received[idx])).map((arg, idx) => _argNames[idx])

export const getExpectedNames = (_argNames, received) =>
    _argNames.filter((arg, idx) => !is.placeholder(received[idx]) || idx >= received.length)

const _toString = (_name, _receivedArgs, _expectedArgs) =>
    `function ${_name}(${_expectedArgs.join(", ")}) => ${_receivedArgs ? +_receivedArgs + ")" : "{}"}`

export const toString = (_name, _argNames, received) => () =>
    _toString(_name, toDisplayName(_argNames, received), getExpectedNames(_argNames, received))

export const pairArgs = (_argNames, received) =>
    received.reduce((obj, value, idx) => {
        const key = !is.undefined(_argNames[idx]) ? _argNames[idx] : idx
        obj[key] = value
        return obj
    }, {})

function desc(fn, fx, received = []) {
    if (!store.has(fn)) store.set(fn, new Set())

    const argNames = getArgNames(fn)
    const receivedNames = getReceivedNames(argNames, received)
    const expectedNames = getExpectedNames(argNames, received)
    fx.receivedNames = receivedNames
    fx.expectedNames = expectedNames

    fx.displayName = fn.name + `(${received.length ? toDisplayName(argNames, received) : toDisplayName(argNames)})`
    fx.toString = () =>
        "function " +
        fn.name +
        "(" +
        expectedNames.join(", ") +
        ") => " +
        fn.name +
        "(" +
        toDisplayName(argNames, received) +
        ", " +
        receivedNames.join(", ") +
        ")"
    //toString(fn.name, argNames, received)

    fx.map = pairArgs(argNames, received)

    store.get(fn).add(fx)

    return fx

    // if (!f._isCurried) {
    //     f._isCurried = true
    //     f._name = fn.name
    //
    //     f._receivedArgs = received
    //     f._argNames = fn._argNames || getArgNames(fn)
    //     f._receivedNames = f._argNames.filter((arg, idx) => is.placeholder(received[idx]) || idx >= received.length)
    //     f.displayName = toDisplayName(f._name, f._argNames, received)
    //
    //     Object.defineProperty(f, "args", {
    //         get: () =>
    //             received.reduce((obj, value, idx) => {
    //                 const key = !is.undefined(f._argNames[idx]) ? f._argNames[idx] : idx
    //                 obj[key] = value
    //                 return obj
    //             }, {})
    //     })
    //
    //     f.toString = () => `function ${f.displayName}( ${f._receivedNames.join(", ")} ) {}`
    //
    //     const map = received.map(
    //         (val, idx) =>
    //             `${f._argNames[idx]}: ` +
    //             (is.placeholder(val) ? "__" : is.func(val) && val.displayName ? val.displayName : `${val}`)
    //     )
    //
    //     console.log(
    //         `%c${f._name}%c(`,
    //         "font-weight:bold;color:#61afef",
    //         "",
    //         map.join(", "),
    //         `) -> ( ${f._receivedNames.join(", ")} )`
    //     )
    // }
    //
    // if (!store.has(fn)) store.set(fn, new Set())
    // store.get(fn).add(f)
    //
    // return f
}

export default desc
