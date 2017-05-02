import bitbox, { map, print } from "../bitbox"

const obj = {}

const box = bitbox(map, {
    foo: ["foo"],
    bar: ["bar"]
})

box(Object.assign, {
    bar: 20,
    foo: 100
})(print)(obj)

export default { box, obj }
