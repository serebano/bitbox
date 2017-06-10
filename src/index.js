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
    keys,
    defaultTo
} = bitbox

const app = box(function app(path, args) {
    const method = last(path)

    if (is.func(method) && method.length > 1) {
        path = path.concat(apply(path.pop(), args.splice(0, method.length - 1)))
        const target = args.length && args.pop()
        console.log(`path-method-1`, path, args)
        return target ? resolve(path, target) : box(app, path)
    }
    if (args.length && !is.func(args[0])) {
        return resolve(path, args[0])
    }
    return box(app, path.concat(args))
})

const foo = app.count.assoc(100)(observable)({})
app.count.observe(log, foo)
app.count.set(inc, foo)

const obj = observable()

//observer.observe(() => app.count(tag`count = ${0}`, log)(obj))

app(set("a", box(assocPath).b.c.d.e.f(1, {})))(obj)
const x = curry((foo, bar, baz) => ({ foo, bar, baz }))

const x2 = x(__(app.items(map(app.value(inc))), __(set("count", add(10))), __(keys)))

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

const b1 = box(concat)

const hi = curry(function hi(name) {
    return `Hello ${name}`
})

const hi2 = hi(__(defaultTo("??"), concat("!"), log))

hi2("Scooby Doo")

const hi3 = hi2(__(concat(__, "Welcome!")))
hi3("serebano")

//__(toUpper)(__(hi, set("foo", __, obj)))("xxxx ouou")

box(resolve(__, new Date())).getTime()

box(resolve(__, obj)).counter(set("value", inc), log, add(20))

box(assocPath).a.b.c.d.e.f.g.h(10, obj)

box(pipe(r.union, resolve)).counter(
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

Object.assign(window, bitbox, { h, hi, hi2, hi3, cnt, r, b1, app, counter, bitbox, obj })
