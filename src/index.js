import * as bitbox from "./bitbox"
import {
    __,
    is,
    box,
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
    resolve
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
        if (key === "apply") return (context, args) => handler.apply(path, args, proxy)
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

function App(path, target) {
    if (is.func(target)) {
        return box(function next($path, $target) {
            return App(path.concat($path, target), $target)
        }, handler)
    }

    return resolve(path, target)
}

App.r = function ramda(path, ...args) {
    const lastKey = path[path.length - 1]
    const fn = is.func(r[lastKey]) && path.pop()
    if (fn) return fn(path, ...args)
    return r.path(path, ...args)
}
App.set = curry((path, value, target) => {
    log({ path, value, target: String(target) })

    return resolve(path.concat(set(path.pop(), value)), target)
})
App.assign = curry((path, value, target) => (target[path.shift()] = r.assocPath(path, value, {})))
App.observe = curry((path, observer, object) => observe(() => observer(resolve(path, object))))

const app = box(App, handler)

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
        dec: app.counter.set("value", dec),
        view: app.counter.value(replace("{count}", __, `<h1>Count({count})</h1>`))
    },
    obj
)

const listItem = app.replace("{text}", __, `<li><b>{text}</b></li>`)

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

Object.assign(window, bitbox, { r, App, app, counter, greet, bitbox, obj })
