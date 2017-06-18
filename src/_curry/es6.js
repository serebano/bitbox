import is from "../is"
const key = "@@functional/placeholder"
export const isPlaceHolder = val => val && val[key] === true

export const _curry0 = fn => {
    return function _curried(...args) {
        if (args.length === 0 || (args.length === 1 && isPlaceHolder(args[0]))) {
            return _curried
        }

        return fn(...args)
    }
}

export const curryN = (n, fn) => {
    if (n === 1) {
        return fn
    }

    return _curry0((...args) => {
        const argsLength = args.filter(arg => !isPlaceHolder(arg)).length

        if (argsLength >= n) {
            return fn(...args)
        }

        return curryN(
            n - argsLength,
            _curry0((...restArgs) => {
                const newArgs = args.map(arg => {
                    if (!isPlaceHolder(arg)) return arg
                    const x = restArgs.shift()
                    if (arg["@@isHandler"]) return arg(x)
                    return x
                })

                return fn(...newArgs, ...restArgs)
            })
        )
    })
}

export const curry = fn => curryN(fn.length, fn)

const defaultTo = curry(function defaultTo(d, v) {
    return v == null || v !== v ? d : v
})

__[key] = true

export function __(fn, ...args) {
    if (!is.func(fn)) return __(defaultTo(fn))

    const $ = arg => arg => (isPlaceHolder(arg) ? __(fn(arg, ...args)) : fn(arg, ...args))
    $[key] = true
    $["@@isHandler"] = true
    $.target = [fn, args]
    $.__ = arg => __(fn(arg, ...args))

    return $
}
