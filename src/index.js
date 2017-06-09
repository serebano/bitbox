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
    apply,
    toUpper,
    observable,
    curry,
    join,
    tap,
    log,
    inc,
    dec,
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
    slice,
    dropLast,
    assocPath,
    take,
    push,
    call,
    keys
} = bitbox

function App(path, __s) {
    const key = last(path)

    if (has(key, bitbox)) {
        path = dropLast(1, path)

        const method = get(key, bitbox)
        if (is.func(method)) {
            // const tMethod = curry.adapt(method)(__(resolve(path)))
            // tMethod(...__s)

            if (method.map) {
                if (has("key", method.map)) {
                    const mkey = method(path.pop())
                    const t__et = __(resolve(path))

                    const mkeyLen = mkey.length
                    const __sLen = __s.length
                    const mArgs = __s.splice(0, mkeyLen - 1)
                    const r = resolve(path.concat(mkey(...mArgs)), ...__s)
                    //console.log(`mkey`, { r, mkey, mkeyLen, __sLen, mArgs, __s })
                    return r
                } else if (has("path", method.map)) {
                    //method.map.path = path
                    //console.log(`method/path`, path, method.map)
                    return method(path, ...__s)
                }
            }
            const m = apply(method, __s)
            const r = resolve(path.concat(m))
            //console.log(`method`, { m, path, r }, method.map)
            return r
        }
    }

    return resolve(path.concat(__s))
}

const app = box((path, ...args) => {
    if (args.length === 1 && !is.func(args[0])) {
        return resolve(path, args[0])
    }
    return box((path, target) => resolve(path, target), path.concat(args))
})
const obj = observable()

//observer.observe(() => app.count(tag`count = ${0}`, log)(obj))

app(set("a", box(r.assocPath).b.c.d.e.f(1, {})))(obj)
const x = curry((foo, bar, baz) => ({ foo, bar, baz }))

const x2 = x(__.items(map(app.value(inc))), __(set("count", add(10))), __(keys))

call(x2, obj, obj, obj)

app.a.b.c.d.e(set("f", inc))(obj)

obj.foo = { x: 1, y: 2 }
obj.name = "my app"
obj.count = 0
obj.todos = []
obj.items = times(as("value"), 10)
obj.numbers = times(id, 10)
obj.counter = { value: 0 }
obj.logs = []

const counter = {}
const b1 = box(concat)

const hi = curry(function hi(name) {
    return `Hello ${name}`
})

const hi2 = hi(__(toUpper, concat("!"), log))

hi2("Scooby Doo")

const hi3 = hi2(__(concat(__, "Welcome!")))
hi3("serebano")

__(toUpper)(__(hi, set("foo", __, obj)))("xxxx ouou")

box(resolve(__, new Date())).getTime()

box(resolve(__, obj)).counter(set("value", inc), log, add(20))

box(assocPath).a.b.c.d.e.f.g.h(10, obj)

box(pipe(r.union, resolve)).counter(
    set("value", inc),
    tap(log),
    "value",
    add(3),
    as("demo"),
    set("demo", add(-100)),
    log
)(obj)

const h = curry(function h(a, b, c, d, e) {
    return { a, b, c, d, e }
})
h(1, 2, 3, 4, 5)

// x('Hello', __.toUpper(), __(add, 1))('jjj',6)

const cnt = set(
    "count",
    __(value => {
        if (!is.number(value)) {
            console.error(`nnumber required`, { value })
            return id
        }
        return value >= 10 ? add(-10) : add(value)
    }),
    obj
)

//console.log(join(" - ", __(times(__, 10)))(concat(__(String), "item ")))

// observe(
//     "items",
//     pipe(map(tag`<li>Count = ${"value"}</li>`), join(""), set("innerHTML", __(tag`<ul>${0}</ul>`), document.body)),
//     obj
// )

observe("count", log, obj)
set("count", inc, obj)

// __(id, "items", map(app.value.tag`itm -> ${0}`), join("\n * "), concat(__, "\n*** Items: \n * "))(obj)

// app.items.map(set("value", inc))(obj)

Object.assign(window, bitbox, { h, hi, hi2, hi3, cnt, r, b1, App, app, counter, bitbox, obj })
