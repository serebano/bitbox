import * as bitbox from "./bitbox"
import {
    is,
    box,
    times,
    map,
    proxy,
    set,
    apply,
    observe,
    toUpper,
    observable,
    curry,
    obs,
    tap,
    log,
    __
} from "./bitbox"
import r from "ramda"

const path = box(r.path)
const obj = observable()

obj.foo = { x: 1, y: 2 }
obj.name = "my app"
obj.count = 0
obj.todos = []
obj.items = times(value => ({ value }), 10)
obj.numbers = times(i => i, 10)

const counter = {
    value: box.value.default(0),
    inc: box.set("value", box.inc),
    dec: box.set("value", box.dec),
    view: box.replace("{count}", __, `<h1>Count({count})</h1>`)
}

const greet = r.replace("{name}", __, "Hello, {name}!")
greet("Alice") //=> 'Hello, Alice!'

const listItem = box.replace("{text}", __, `<li><b>{text}</b></li>`)

// const render = curry((elm, val) => set("innerHTML", val, document.querySelector(elm)))
// const start = tap(x => (x.id = setInterval(() => x.count++)))
// const stop = tap(x => clearInterval(x.id))
// const app = obs(box.count(render("#root")))
//
// const addTodo = curry(function addTodo(text, target) {
//     target.push({ text, done: false, id: target.length, date: new Date() })
//     return target
// })
// const listItem = box(v => `<li><b>${v.done}</b> | ${v.text}</li>`)
// const renderTodos = box.map(listItem).join("\n")(render("#dev"))
// const completed = box.filter(box.done.eq(true))
// const incomplete = box.filter(box.done.eq(false))
// const sortByDate = box(r.sortBy(box.date))
// const setCompleted = set("done")
//
// box.todos(addTodo("dev bitbox"), addTodo("write simple code"))(obj)
// box.todos[0](setCompleted(true))(obj)
// box.todos[1](setCompleted(true))(obj)
//
// box.map(addTodo(__, box.todos(obj)), ["write app demo", "make tests", "get hi"])
//
// box.todos(renderTodos)(obj)

//const todos = { renderTodos, listItem, completed, incomplete, sortByDate, setCompleted }
//box.todos(addTodo("do it")).map(box.text(v => `<li>${v}</li>`)).join("")(render("#dev"))(obj)

obj.foo = { count: 0 }

// app(obj.foo)
// start(obj.foo)

Object.assign(window, bitbox, { r, counter, greet, bitbox, obj })
