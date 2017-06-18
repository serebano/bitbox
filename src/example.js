import is from "./is"
import * as bitbox from "./bitbox"
import r from "ramda"
import app from "./app"
const {
    __,
    id,
    path,
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
    getPath,
    keys,
    defaultTo,
    delay,
    pick,
    functions,
    argx,
    pipeP,
    flip,
    contains,
    box
} = bitbox

const obj = observable()
app.foo.set(app.count.assoc(10, {}), obj)

const foo = app.foo
foo.count.observe(log, obj)
foo.count.set(inc, obj)

// const run = delay(foo.count.set(inc), 3000)
// run(obj)

app(set("a", path(assocPath).b.c.d.e.f(1, {})))(obj)
const x = curry((foo, bar, baz) => ({ foo, bar, baz }))

const x2 = x() //__(app.items(map(app.value(inc)))), __(set("count", add(10))), __(keys))

app.a.b.c.d.e(set("f", inc))(obj)

obj.xy = { x: 1, y: 2 }
obj.name = "my app"
obj.count = 0
obj.todos = []
obj.items = times(as("value"), 10)
obj.numbers = times(id, 10)
obj.counter = { value: 0 }
obj.logs = []

const setInc = set(__, inc(__(0)))
const pathInc = path(getPath(__, setInc))
const setBox = path(getPath(__, __(argx(set, 1))))
const observeBox = path(getPath(__, __(argx(observe, 1))))
const toJSON = res => res.json()
const github = path(
    box((url, resolve) => fetch(url).then(toJSON).then(resolve))(__(concat(__(join("/"))), "https://api.github.com/"))
)

const xfn = box.fn("{set, inc,__}", "key", "target", "set(key, inc(__(0)), target)")
xfn({ set, inc, __ }, "count", obj)

const getRepo = github.repos.serebano
const setRepo = argx(set(__, __(pick(["git_url", "owner", "id"]))), 0, 2)

observeBox.bitbox(log, obj)
github.repos.serebano.bitbox(setRepo("bitbox", obj))

setBox.name(__(toUpper(__(concat, "Mr. "))))("serebano", obj)

observeBox.x(console.warn, obj)
observeBox.y(console.warn, obj)
observeBox.z(console.warn, obj)

setInc("x", obj)
setInc("y", obj)
setInc("z", obj)

pathInc.x(obj)
pathInc.y(obj)
pathInc.items[0].value(obj)
pathInc.items[1].count(obj)
pathInc.items[1].foo(obj)

app.items(take(5), tap(map(pathInc.value)), log)(obj)

const b1 = path(concat)

const hi = curry(function hi(name) {
    return `Hello ${name}`
})

const hi2 = hi(__(toUpper))

hi2("Scooby Doo")

const hi3 = hi2(__(concat, "Mr. "))
hi3("serebano")

const hi4 = hi3(__(join(" - ")))

hi4(["Sergiu", "Toderascu"])

path(resolve(__, new Date())).getTime()
path(resolve(__, obj)).counter(set("value", inc), log, add(20))
path(assocPath).a.b.c.d.e.f.g.h(10, obj)

const counter = app(observable)({ value: 0 })
app.count.observe(app(tag`item = ${0}`, log), obj)
app.count.set(inc, obj)

observe("count", log, obj)
set("count", inc, obj)

app.items.map(set("value", inc))(obj)
const app2 = path((path, ...args) => {
    const key = last(path)
    if (has(key, functions)) {
        path.pop()
        const fn = get(key, functions)
        // const target = getPath(
        //     path,
        //     (key, target) => {
        //         return target[key]
        //     },
        //     args.pop()
        // )
        if (contains("key", fn.rest)) {
            return getPath(path, fn(__, ...args), args.pop())
        }
        return fn(...args, getPath(path, get, args.pop()))
    }
    return getPath(path, get, ...args)
})
//.add(1)

Object.assign(window, bitbox, {
    functions,
    x2,
    hi,
    app2,
    setInc,
    setBox,
    setRepo,
    getRepo,
    pathInc,
    hi2,
    hi3,
    hi4,
    github,
    r,
    b1,
    app,
    counter,
    bitbox,
    obj
})
