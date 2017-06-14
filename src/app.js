import { has, get, path, getPath, observable, resolve, last, apply, log, inc, tap, is, delay } from "./bitbox"
import * as functions from "./operators"

function getFn(keys, args, functions) {
    const fnKey = last(keys)
    if (!has(fnKey, functions)) return false

    const fn = get(keys.pop(), functions)
    const hasKey = fn.rest && fn.rest.includes("key")

    const fnArgs = hasKey && keys.length
        ? [keys.pop()].concat(args.splice(0, fn.length - 2))
        : args.splice(0, fn.length - 1)

    const fx = fnArgs.length ? apply(fn, fnArgs) : fn
    //const rx = resolve(path.concat(fx))
    //console.log(`(fn@${fnKey}) ->`, fx.length, { fnKey, hasKey, fx, fnArgs })
    //return rx
    return path(app, keys.concat(fx))
}

function app(keys, ...args) {
    const method = last(keys)
    const f = getFn(keys, args, functions)
    //console.log(`app`, { path, args, f })

    if (is.func(method) && method.length > 0) {
        const res = apply(keys.pop(), args.splice(0, method.length - 1))
        keys = keys.concat(res)
        const target = args.length && args.pop()

        //console.log(`path-method-1`, { path, args, res })
        //return box(app, path.concat(args));
        return target ? resolve(keys, target) : path(app, keys.concat(args))
    }

    if (is.func(method)) {
        keys = keys.concat(apply(keys.pop(), args))
        //console.log(`app-method-2`, { path, args, method, target })
    }

    const target = args.length && !is.func(last(args)) && args.pop()

    if (target) {
        return resolve(keys, target)
    }

    return path(app, keys.concat(args))
}

// const one = box(app).count.assoc(1)(observable)
// const obj = one({})
//
// one.count.observe(log, obj)
// one.count.set(inc, obj)

export default path(app)
