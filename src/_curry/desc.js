import { getArgNames, toCamelCase, toDisplayName } from "../utils"
import is from "../is"
export const store = new Map()
export const index = new Set()

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
                    : is.complexObject(value) ? JSON.stringify(value) : is.string(value) ? `"${value}"` : `${value}`
            }
            return name
        })
        .join(", ")
}
function toStringMap(argNames, received) {
    return argNames
        .map((name, idx) => {
            let value = received[idx]
            if (is.undefined(value)) return name
            let strval
            if (is.func(value)) {
                if (value.length <= 1) {
                    strval = value.displayName || value.name
                } else {
                    strval = is.placeholder(value)
                        ? value["@@isHandler"] ? name + " => " + value.args.map(String).join(", ") : name
                        : value.displayName || String(value)
                }
            } else if (is.array(value))
                //value.displayName || String(value)
                strval = "[" + value.map(val => String(val)).join(", ") + "]"
            else if (is.object(value)) strval = String(value)
            else if (is.string(value)) strval = `"${value}"`
            else strval = `${value}`
            return strval
        })
        .join(", ")
}
function desc(fn, fx, received = [], argNames = [], idxMap = []) {
    if (!store.has(fn)) {
        store.set(fn, new Set())
        fn.store = store.get(fn) //fnStore
    }
    const fnStore = fn.store

    index.add(fn)
    index.add(fx)

    fx.fn = fn
    fn.store = fnStore

    const name = fn.displayName || fn.name
    const expectedNames = fx.expectedNames || argNames
    const receivedMap = idxMap.map((name, idx) => [name, received[idx]])
    const stringMap = toStringMap(argNames, received)

    fx.displayName = name + "(" + stringMap + ")"
    //fx.toString = () => "(" + expectedNames.join(", ") + ")" + " => " +
    //fx.toString = () => "(" + expectedNames.join(", ") + ") => " + name + "(" + stringMap + ")"
    fx.args = received
    fx.argNames = argNames
    fx.idxMap = idxMap
    fnStore.add(fx)

    //  console.log(fnStore.size, fx)

    return fx
}

export default desc
