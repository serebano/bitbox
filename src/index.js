import * as bitbox from "./bitbox"
import { is, box, times, map, set, apply, observe, toUpper, observable, curry, obs, bx, tap, log, __ } from "./bitbox"
import r from "ramda"

const path = bx(r.path)
const obj = observable()

obj.foo = { x: 1, y: 2 }
obj.name = "my app"
obj.count = 0
obj.todos = [
    {
        text: "dev bitbox",
        done: true
    },
    {
        text: "write simple code",
        done: false
    }
]
obj.items = times(value => ({ value }), 10)
obj.numbers = times(i => i, 10)

const render = curry((elm, val) => set("innerHTML", val, document.querySelector(elm)))
const start = tap(x => (x.id = setInterval(() => x.count++)))
const stop = tap(x => clearInterval(x.id))
const app = obs(bx.count(render("#root")))

const addTodo = curry(function addTodo(text, target) {
    target.push({ text, done: false, id: target.length })
    return target
})
const listItem = bx(v => `<li><b>${v.done}</b> | ${v.text}</li>`)
const completed = bx.done.eq(false)

bx.todos(addTodo(Date())).map(listItem).join("\n")(render("#dev"))(obj)

//bx.todos(addTodo("do it")).map(bx.text(v => `<li>${v}</li>`)).join("")(render("#dev"))(obj)

obj.foo = { count: 0 }

app(obj.foo)
start(obj.foo)

Object.assign(window, bitbox, { r, listItem, completed, bitbox, addTodo, obj, log, start, stop, render })
