import curry from "./curry"
import is from "./is"
import { getArgNames } from "./utils"
import print from "./operators/print"
import isCurryable from "./curry/isCurryable"

const log = curry(a => console.log(a))

function func(fn, ...args) {
    const fnArgNames = fn.argNames || getArgNames(fn)
    const length = args.length
    const pair = args.map((name, idx) => {
        if (is.array(name)) {
            const [tName, asName] = name
            const tIndex = fnArgNames.includes(tName) ? fnArgNames.indexOf(tName) : idx

            return [tIndex, asName, tName]
        }
        return [fnArgNames.includes(name) ? fnArgNames.indexOf(name) : idx, name]
    })

    const tArgNames = []
    const tArgIdx = []

    const map = args.reduce((obj, name, index) => {
        let tName = name
        if (is.array(name)) {
            tName = name[0]
            name = name[1]
        }

        const tArgIndex = fnArgNames.includes(tName) ? fnArgNames.indexOf(tName) : index
        const tArgName = fnArgNames[index]

        tArgNames[tArgIndex] = name
        tArgIdx[tArgIndex] = index

        obj[index] = {
            name,
            tName,
            tArgName,
            tArgIndex
        }
        return obj
    }, [])
    const pairArgs = (idxs, args) => idxs.map(i => args[i])
    function fx() {
        const args = pairArgs(tArgIdx, arguments)
        //log(arguments)
        log(args)
        log(tArgNames)

        return fn.apply(this, args)
    }

    fx.displayName = "$" + (fn.displayName || fn.name)
    fx.toString = () => `(${map.map(a => a.name).join(", ")}) => ${fn.displayName}(${tArgNames.join(", ")})`

    print(map)
    console.log(`${fx.displayName}`, ...pair)
    log(tArgNames)
    log(fnArgNames)
    log(tArgIdx)

    const f = curry.to(length, fx, map.map(a => a.name))

    f.fn = fn
    f.map = map
    f.pair = pair

    return f
}

function debug(fn) {
    const o = {
        length: fn.length,
        name: fn.name,
        displayName: fn.displayName,
        isCurryable: isCurryable(fn),
        argNames: fn.argNames || getArgNames(fn),
        received: fn.args,
        expected: fn.rest
    }
    print(o)
    console.log(o)
}

curry.func = func
curry.d = debug

export default curry
