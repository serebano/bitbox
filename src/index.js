import is from "./is"
import * as bitbox from "./bitbox"
import r from "ramda"

const {
    __,
    id,
    box,
    use,
    times,
    map,
    set,
    has,
    get,
    tag,
    arg,
    apply,
    toUpper,
    observable,
    curry,
    join,
    obs,
    tap,
    log,
    inc,
    dec,
    replace,
    pipe,
    as,
    add,
    proxy,
    view,
    resolve,
    last,
    concat,
    ife,
    observe,
    slice
} = bitbox
function take(n, xs) {
    return slice(0, n < 0 ? Infinity : n, xs)
}
function dropLast(n, xs) {
    return take(n < xs.length ? xs.length - n : 0, xs)
}
function App(path, args) {
    const key = last(path)
    if (has(key, bitbox)) {
        path = dropLast(1, path)

        const method = get(key, bitbox)
        if (is.func(method)) {
            if (method.map) {
                if (has("key", method.map)) {
                    method.map.key = path.pop()
                } else if (has("path", method.map)) {
                    method.map.path = path
                    console.log(`method/path`, path, method.map)
                    return apply(method, args)
                }
            }
            const m = apply(method, args)
            const r = resolve(path.concat(m))
            console.log(`method`, { m, path, r }, method.map)
            return r
        }
    }

    return resolve(path.concat(args))
}

const app = box(App)
const obj = observable()

obj.foo = { x: 1, y: 2 }
obj.name = "my app"
obj.count = 0
obj.todos = []
obj.items = times(as("value"), 10)
obj.numbers = times(id, 10)
obj.counter = { value: 0 }

const counter = {}
const b1 = box(concat)

box(resolve(__, new Date())).getTime()

box(use(pipe, [resolve, resolve])).counter(set("value", inc), log, add(20))(obj)

box(r.assocPath, [0]).a.b.c.d.e.f.g.h(10, log)(obj)

box(pipe(r.union, resolve)).counter(
    set("value", inc),
    tap(log),
    "value",
    add(3),
    as("demo"),
    set("demo", add(-100)),
    log
)(obj).demo

const hi = set("greeting", arg(concat("Hello ")), obj)
hi("serebano")

const h = curry(function h(a, b, c, d, e) {
    return { a, b, c, d, e }
})
h(1, 2, 3, 4, 5)

// x('Hello', arg.toUpper(), arg(add, 1))('jjj',6)

const cnt = set(
    "count",
    arg(value => {
        if (!is.number(value)) {
            console.error(`nnumber required`, { value })
            return id
        }
        return value >= 10 ? add(-10) : add(value)
    }),
    obj
)

//console.log(join(" - ", arg(times(arg, 10)))(concat(arg(String), "item ")))

observe(
    "items",
    pipe(map(tag`<li>Count = ${"value"}</li>`), join(""), set("innerHTML", arg(tag`<ul>${0}</ul>`), document.body)),
    obj
)
app.count.observe(log, obj)
app.count.set(inc, obj)

arg(id, "items", map(app.value.tag`itm -> ${0}`), join("\n * "), concat(arg, "\n*** Items: \n * "))(obj)

app.items.map(set("value", inc))(obj)

Object.assign(window, bitbox, { h, cnt, r, b1, App, app, counter, bitbox, obj })
