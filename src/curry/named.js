import R from "ramda"
import curry from "./curry.x"
import isCurryable from "./isCurryable"

export default function namedCurry(fn, ...argNames) {
    // TODO: what if fn.length != argNames.length?
    // if (fn["secret-sauce"]) {
    //     const props = R.head(argNames)
    //     if (R.type(props) == "Object") return config(fn, props)
    //     return fn
    // }
    function $() {
        return fn.apply(this, arguments)
    }
    //$.displayName = fn.displayName
    const f = curry.to(fn.length, $)
    f["secret-sauce"] = {
        argNames: argNames
    }
    //f.toString = a => fn.toString(a)
    f.config = (...r) => config(f, ...r)
    return f
}

function makeArgs(inputArgs, argNames, config) {
    var idx = 0
    var outputArgs = []
    R.forEach(function(argName) {
        if (argName in config && outputArgs.indexOf(config[argName]) === -1) {
            outputArgs.push(config[argName])
        } else if (outputArgs.indexOf(inputArgs[idx]) === -1) {
            outputArgs.push(inputArgs[idx])
            idx += 1
            // TODO: proper bounds checking.
        }
    }, argNames)
    return outputArgs
}

export function config(fn, props) {
    const sauce = fn["secret-sauce"]
    if (!sauce) {
        throw TypeError("Configure called on function without secret sauce")
    }
    const config = R.merge(sauce.config ? sauce.config : {}, props)
    const argNames = sauce.argNames
    const unassigned = R.difference(argNames, R.keys(config)).length
    // TODO: what if unassigned is 0? Does this return value or thunk?
    function $() {
        const a = makeArgs(arguments, argNames, config)
        console.log(`A`, arguments, argNames, config, a)
        return fn.apply(this, a)
    }
    //$.displayName = fn.displayName
    const f = curry.to(unassigned, $)
    //f.toString = a => fn.toString(a)
    f["secret-sauce"] = {
        argNames: argNames,
        config: config
    }
    f.config = (...r) => config(f, ...r)
    console.log(`unassigned`, { unassigned, config, argNames, fn, props, f, $ })
    return f
}
