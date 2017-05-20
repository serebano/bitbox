import box from "../box"
import project from "../project"
import observe from "../observe"
import observable from "../observable"
import { stringify } from "../operators"

export const obj = {
    count: 0,
    items: []
}

export function inc() {
    if (this.count >= 1000 && this.stop) {
        this.stop()
        this.count = 0

        setTimeout(() => {
            this.start()
        }, 5000)
    }
    return ++this.count
}

export function on(fn) {
    return observe(fn, this)
}

const run = {
    start(ms = 10) {
        clearInterval(this.id)
        this.id = setInterval(() => this.inc(), ms)
        this.status = `Running(${ms})`
    },
    stop() {
        clearInterval(this.id)
        this.id = 0
        this.status = `Stopped`
    }
}

export const pro = project(
    obj,
    observable({
        count: 0,
        status: "idle",
        inc
    })
)

export const one = box.one(
    observable,
    project({
        count: 0,
        inc,
        on,
        ...run
    })
)(obj)

one.on(
    box.count(String, value => {
        document.body.innerHTML = `<h1>/ ${one.id}:${one.status} = ${value}</h1><pre>${stringify(4)(one.$)}</pre>`
    })
)
one.start()
