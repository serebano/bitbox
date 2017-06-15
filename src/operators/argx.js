import curry from "../curry"
import diff from "./diff"

export default curry(function argx(fn) {
    const argNames = fn.argNames || []
    let args = Array.prototype.slice.call(arguments, 1)
    args = args.concat(argNames.map((arg, idx) => idx).filter(idx => args.indexOf(idx) === -1))
    console.log(`args`, args)

    function fx() {
        return fn.apply(this, args.map(idx => arguments[idx]))
    }

    fx.displayName = fn.displayName
    fx.toString = (...a) => fn.toString(...a)

    return curry.to(fn.length || args.length, fx, args.map(idx => argNames[idx] || idx))
})
