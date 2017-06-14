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
    pipeP,
    flip
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

const x2 = x(__(app.items(map(app.value(inc)))), __(set("count", add(10))), __(keys))

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
const setBox = path(getPath(__, __(curry.map(set, 1))))
const observeBox = path(getPath(__, __(curry.map(observe, 1))))
const toJSON = res => res.json()
//pipeP(fetch, toJSON)(__(concat(__(join("/"))), "https://api.github.com/"))
const github = path(
    curry((url, resolve) => fetch(url).then(toJSON).then(resolve))(__(concat(__(join("/"))), "https://api.github.com/"))
)

const getRepo = github.repos.serebano
const setRepo = curry.map(set(__, __(pick(["git_url", "owner", "id"]))), 0, 2)

observeBox.repos(log, obj)
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

//__(toUpper)(__(hi, set("foo", __, obj)))("xxxx ouou")

path(resolve(__, new Date())).getTime()

path(resolve(__, obj)).counter(set("value", inc), log, add(20))

path(assocPath).a.b.c.d.e.f.g.h(10, obj)

path(pipe(r.union, resolve)).counter(
    set("value", inc),
    //tap(log),
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

// items = app.items
// itemValues = items.pluck('value')
// itemTags = itemValues.map(tag`Item #${0}`)
// itemTags.join('\n', obj)
// //items.observe(log, obj)
// getItem = idx => items[idx].value
// setitem = curry((idx,obj) => getItem(idx).set(add(idx), obj))
// getItem(1).observe(log, obj)
// setitem(1, obj)

const counter = app(observable)({ value: 0 })
app.count.observe(app(tag`item = ${0}`, log), obj)
app.count.set(inc, obj)

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

Object.assign(window, bitbox, {
    functions,
    h,
    x2,
    hi,
    setInc,
    setBox,
    setRepo,
    getRepo,
    pathInc,
    hi2,
    hi3,
    hi4,
    cnt,
    github,
    r,
    b1,
    app,
    counter,
    bitbox,
    obj
})
