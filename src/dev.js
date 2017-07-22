import is from "./is"
import curry from "./curry"
import __ from "./__"
import path from "./path"
import resolve from "./resolve"
import { last, drop, concat, has, get, set, inc, times, identity, to, apply } from "./operators"
import * as functions from "./operators"
import box from "./box"
export * from "./examples/counter"

export const o = Object.assign({}, functions) //{ __, curry }
export const g = box(o)

export const setItems = set(__, __(times(to({ id: identity, count: inc }))))
o.setItems = setItems

export const obj = g.observable({
    app: { count: 0 },
    arr: ["First", 2, {}]
})

export const a = g[0][1].concat("x").concat("y").as("value").assign({ id: 100 }).tap(g.set("name", "Serebano"))

export const b = g.foo
    .add(__(g.add(20)), __(3))
    .add(30)
    .as("num")
    .tap(set("num", g.add(2)))
    .tap(setItems("items", 10))
    .tap(g.tap(g.observe(set("num", g.add(3)))).observe(g.log))

//b(obj).num++

//g.setItems(10, obj)

// import("./curry.js").then(({ default: theDefault }) => {
//     console.log(theDefault)
// })

// g.a
//     .concat(__, ["x", "y"])
//     .join(" * ")
//     .split(" * ")
//     .sortBy(g[0])
//     .map(g.toUpper)
//     .take(-3)
//     .reverse()
//     .assocPath(__, 10, {})
//     .as("foo")
//     //.tap(g.foo.Y.X.set("C", g.inc))
//     .log({ a: ["a", "b", "c"] })

// api.a
//     .concat(__, ["z", "x", "y"])
//     .join(" * ")
//     .split(" * ")
//     .map(api.toUpper().as("item"))
//     .sortBy(api.item)
//     .as("foo")
//     .log()({ a: ["a", "b", "c"] })
//
// api
//     .assoc(api.g[2].a.b.c.d[1].e.f[4].g.h.d.$, 100)
//     .g[api.id(2).a.b.c].d.concat(["xxx", { h: { v: 5 } }])
//     .as("hhhh")
//     .log()({})

export function Demo(key, value, object) {
    return { key, value, object }
}

export function h(a, b, c) {
    return [a, b, c]
}

export function args(...args) {
    return args
}

export const x = curry(h)
