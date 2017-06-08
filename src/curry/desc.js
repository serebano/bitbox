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

export const pairArgs = (names, values, fn) => {
    return new Proxy(
        names.reduce((obj, name, idx) => {
            obj[name] = values[idx]
            return obj
        }, {}),
        {
            get(target, key) {
                return target[key]
            },
            set(target, key, value) {
                const idx = names.indexOf(key)
                if (idx > -1) {
                    target[key] = values[idx] = value
                    return true
                }
            },
            deleteProperty(target, key) {
                const idx = names.indexOf(key)
                if (idx > -1) {
                    values.splice(idx, 1)
                    delete target[key]
                    return true
                }
            }
        }
    )
}

function toArgsString(names = [], values) {
    return names
        .map((name, index) => {
            if (!is.undefined(values[index])) {
                const value = values[index]
                return is.func(value)
                    ? value.displayName || value.toString()
                    : is.object(value) ? JSON.stringify(value) : is.string(value) ? `"${value}"` : `${value}`
            }
            return name
        })
        .join(", ")
}

function desc(fn, fx, received = [], argNames = [], idxMap = []) {
    if (!store.has(fn)) store.set(fn, new Set())

    const name = fn.displayName || fn.name
    fx.displayName = name + `(${toArgsString(fx.receivedNames, received)})`

    fx.toString = () =>
        "function " +
        name +
        (fn.length - received.length) +
        "(" +
        fx.expectedNames.join(", ") +
        ") => " +
        name +
        "(" +
        toArgsString(argNames, received) +
        //", " +
        //receivedNames.join(", ") +
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
