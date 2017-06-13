import { box, has, get, path, observable, resolve, last, apply, log, inc, tap, is, delay } from "./bitbox"
import * as functions from "./operators"

function getFn(path, args, functions) {
    const fnKey = last(path)
    if (!has(fnKey, functions)) return false

    const fn = get(path.pop(), functions)
    const hasKey = fn.rest && fn.rest.includes("key")

    const fnArgs = hasKey && path.length
        ? [path.pop()].concat(args.splice(0, fn.length - 2))
        : args.splice(0, fn.length - 1)

    const fx = fnArgs.length ? apply(fn, fnArgs) : fn
    //const rx = resolve(path.concat(fx))

    console.log(`(fn@${fnKey}) ->`, fx.length, { fnKey, hasKey, fx, fnArgs })
    //return rx
    return box(app, path.concat(fx))
}

box.getFn = getFn
function app(path, ...args) {
    const method = last(path)
    const f = getFn(path, args, functions)
    console.log(`app`, { path, args, f })

    if (is.func(method) && method.length > 0) {
        const res = apply(path.pop(), args.splice(0, method.length - 1))
        path = path.concat(res)
        const target = args.length && args.pop()

        console.log(`path-method-1`, { path, args, res })
        //return box(app, path.concat(args));
        return target ? resolve(path, target) : box(app, path.concat(args))
    }

    if (is.func(method)) {
        path = path.concat(apply(path.pop(), args))
        console.log(`app-method-2`, { path, args, method, target })
    }

    const target = args.length && !is.func(last(args)) && args.pop()

    if (target) {
        return resolve(path, target)
    }

    return box(app, path.concat(args))
}

// const one = box(app).count.assoc(1)(observable)
// const obj = one({})
//
// one.count.observe(log, obj)
// one.count.set(inc, obj)

export default box(app)
