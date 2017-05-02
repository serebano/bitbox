import bitbox, { observe, observable, map } from "../bitbox"
import { inc, print } from "../operators"

const obj = observable({})

bitbox(Object.assign, {
    bar: 20,
    foo: 100,
    count: 0
})(obj)

const box = bitbox(map, {
    foo: ["foo"],
    bar: ["bar"],
    count: ["count"],
    inc: target => box => box(target, box(inc)),
    run: target => box => setInterval(() => box(target, box(inc)), 1000)
})

box(print)(obj)

box(obj).inc(box.foo)
box(obj).inc(box.bar)

observe(obj, box.count(print))

box(obj).run(box.count)

export default { box, obj }
