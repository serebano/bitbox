import curry from "./curry/curry.x"
import { getArgNames } from "./utils"
import print from "./operators/print"

const log = curry(a => console.log(a))

function func(fn, ...args) {
    const fnArgNames = fn.argNames || getArgNames(fn)
    const length = args.length
    const pair = args.map((name, idx) => [name, fnArgNames.indexOf(name)])
    const map = args.reduce(
        (obj, name, index) => {
            obj[index] = {
                index,
                name,
                targetIndex: fnArgNames.indexOf(name)
            }
            return obj
        },
        { length: args.length }
    )

    function fx() {
        const targetArgs = pair.map(a => arguments[a[1]])
        log(targetArgs)
        return fn.apply(this, targetArgs)
    }
    fx.displayName = "$" + (fn.displayName || fn.name)

    console.log(`${fx.displayName}`, map, ...pair)

    const f = curry.to(length, fx, args)

    f.fn = fn
    f.map = map
    f.pair = pair

    return f
}

curry.func = func

export default curry
