import * as bitbox from "./bitbox"
import { is, box, pipe, compose, observe, observable, curry, curryN, __ } from "./bitbox"
import r from "ramda"

const assoc = box((path, value, object) => {
    return r.assocPath(path, value, object || {})
})

const log = r.pipe(
    (path, ...args) => ({ path, args }),
    curry(JSON.stringify)(__, null, 4),
    console.log
)

const obj = observable(assoc.a.b.c.items[0]({ id: 0, count: 0 }, {}))

const app = box(function App(path, ...args) {
    console.log(`[APPLY] ${path.join(".")}`, args)

    if (args.length && is.complexObject(args[args.length - 1])) {
        const obj = args.pop()

        if (Reflect.has(r, path[path.length - 1])) {
            const ext = Reflect.get(r, path.pop())

            return ext(...args, r.path(path, obj))
        }

        //const target = r.path(path, obj)

        return [r.path(path)].concat(args).reduce((f, g) => (...args) => f(g(...args)))(obj)
    }

    return [r.path(path)].concat(args).reduce((f, g) => (...args) => f(g(...args)))
})

app.get = (target, keys, receiver) => {
    console.log(`[GET] ${keys.join(".")}`)
    return box(target, keys, false)
}

const obs = curry((observer, target) => observe(() => observer(target)))

app.a.b.c.items[0](obj).count = 0
app.a.b.c(obj).items = r.times(id => ({ id, count: 0 }), 10)

app.a.b.c.items.map(obs(r.pipe(JSON.stringify, console.log)))(obj)
app.a.b.c.items(r.keys, r.tap(console.log))(obj)

Object.assign(window, bitbox, { r, bitbox, obj, app, log })
