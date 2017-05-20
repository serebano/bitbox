import box from "../box"
import project from "../project"
import observe from "../observe"
import observable from "../observable"

export const obj = {
    count: 0,
    items: []
}

export function inc() {
    return ++this.count
}

export function on(fn) {
    return observe(fn, this)
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
        on
    })
)(obj)

one.on(box.count(print))
one.inc()
