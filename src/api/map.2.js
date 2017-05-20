import box from "../box"
import project from "../project"
import resolve from "../resolve"
import observable from "../observable"
import observe from "../observe"
import { print, stringify } from "../operators"

const React = {
    createElement(tag, props, ...children) {
        props.children = children
        return { tag, props }
    }
}

export function inc() {
    return ++this.count
}

export function obs(fn) {
    return observe(fn, this)
}

export const obj = {}
export const pro = project(
    obj,
    observable({
        count: 0,
        status: "idle",
        inc
    })
)

export const abox = box.a(
    observable,
    project({
        count: 0,
        inc,
        obs
    })
)(obj)

abox.obs(box.count(print))
abox.inc()

observe(() => {
    if (pro.count > 100) {
        pro.stop()
        pro.count = 0
        pro.status = "Done"
    }
})

observe(() => print(project(pro, { count: 0, status: "none" })))

pro.start = function start(ms) {
    clearInterval(this.id)
    this.id = setInterval(() => this.inc(), ms)
    this.status = `Running[${this.id}]`
}
pro.stop = function stop() {
    this.id = clearInterval(this.id)
    this.status = `Stopped`
}

export function one(path, obj, ...args) {
    const result = resolve(obj, path, ...args)
    print({ path, obj, args, result })
    return result
}

// bitbox(one).foo({ foo: [1, 2, 3] })
// print(
//     bitbox(one, {
//         size() {
//             return this.length
//         }
//     })(["Thing", "To Make"]).size()
// )

export class Timer {
    constructor() {
        const o = observe(
            box.timer(value => {
                document.body.innerHTML = `<h1>${value}</h1>`
                if (value >= 1000) {
                    this.stop()
                    document.body.innerHTML = `<pre>${stringify(4)(o)}</pre>`
                }
            }),
            observable(this, "timer", 0)
        )
        this.start(1)
    }
    start(ms) {
        this.stop()
        this.id = setInterval(() => this.inc(), ms)
    }
    stop() {
        clearInterval(this.id)
        setTimeout(() => {
            this.reset()
            this.start()
        }, 50000)
    }
    inc() {
        this.timer += 1
    }
    reset() {
        this.timer = 0
    }
}

export const timer = new Timer()

const count = observable(0)
count.observe(print)
count.inc = () => count.value++
count.inc()

const myName = observable(`Serebano | count = ${count}`)
myName.observe(print)

export function ToDoItem(props) {
    return <div>{props.item}</div>
}
