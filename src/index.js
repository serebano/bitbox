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
    arg,
    apply,
    observe,
    toUpper,
    observable,
    curry,
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
    ife
} = bitbox

function App(path, args) {
    const key = last(path)
    //if (has(key, api)) return apply(get(key, api), args)
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

app.count.observe(pipe(add(100), String, as("xxx"), log), obj)

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

Object.assign(window, bitbox, { cnt, r, b1, App, app, counter, bitbox, obj })
