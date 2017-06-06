import is from "./is"
import * as bitbox from "./bitbox"
import {
    __,
    box,
    use,
    times,
    map,
    set,
    has,
    get,
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
} from "./bitbox"
import r from "ramda"

const greet = replace("{name}", __, "Hello, {name}!")
const api = {
    ...bitbox,
    sayHi: curry((name, obj) => (obj.hi = greet(name))),
    test(...args) {
        console.log(`rtest`, args)
    }
}

const handler = {
    get(path, key) {
        //if (key === "apply") return (context, args) => handler.apply(path, args, proxy)
        if (key === "length" && is.func(path[path.length - 1])) return path[path.length - 1].length
        if (has(key, api)) {
            return App(path, get(key, api))
        }

        return App(path, a => a)
    },
    has(path, key) {
        return has(key, api)
    }
}

function App(path, args) {
    const key = last(path)

    if (has(key, api)) {
        const method = get(key, api)

        return apply(method, args)
    }
    return resolve(path.concat(args))
}

App.set = curry((path, value, target) => {
    return resolve(path.concat(set(path.pop(), value)), target)
})
App.assign = curry((path, value, target) => (target[path.shift()] = r.assocPath(path, value, {})))
App.observe = curry((path, observer, object) => observe(() => observer(resolve(path, object))))

const app = box(App)
const obj = observable()

obj.foo = { x: 1, y: 2 }
obj.name = "my app"
obj.count = 0
obj.todos = []
obj.items = times(value => ({ value }), 10)
obj.numbers = times(i => i, 10)
obj.counter = { value: 0 }

app.count.observe(pipe(add(100), String, as("xxx"), log), obj)

const counter = view(
    {
        value: app.counter.value,
        inc: app.counter.set("value", inc),
        dec: app.counter.set("value", dec)
    },
    obj
)

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

//b1.counter(set("value", inc), ife(has("count"), set("count", add(10)), set("count", 1)), tap(log))

// const render = curry((elm, val) => set("innerHTML", val, document.querySelector(elm)))
// const start = tap(x => (x.id = setInterval(() => x.count++)))
// const stop = tap(x => clearInterval(x.id))
// const app = obs(app.count(render("#root")))
//
// const addTodo = curry(function addTodo(text, target) {
//     target.push({ text, done: false, id: target.length, date: new Date() })
//     return target
// })
// const listItem = box(v => `<li><b>${v.done}</b> | ${v.text}</li>`)
// const renderTodos = app.map(listItem).join("\n")(render("#dev"))
// const completed = app.filter(app.done.eq(true))
// const incomplete = app.filter(app.done.eq(false))
// const sortByDate = box(r.sortBy(app.date))
// const setCompleted = set("done")
//
// app.todos(addTodo("dev bitbox"), addTodo("write simple code"))(obj)
// app.todos[0](setCompleted(true))(obj)
// app.todos[1](setCompleted(true))(obj)
//
// app.map(addTodo(__, app.todos(obj)), ["write app demo", "make tests", "get hi"])
//
// app.todos(renderTodos)(obj)

//const todos = { renderTodos, listItem, completed, incomplete, sortByDate, setCompleted }
//app.todos(addTodo("do it")).map(app.text(v => `<li>${v}</li>`)).join("")(render("#dev"))(obj)

obj.foo = { count: 0 }

// app(obj.foo)
// start(obj.foo)

Object.assign(window, bitbox, { r, b1, App, app, counter, greet, bitbox, obj })
