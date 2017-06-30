import is from "./is"
import curry from "./curry"
import __ from "./__"
import path from "./path"
import resolve from "./resolve"
import { last, drop, concat, has, get, apply } from "./operators"
import * as functions from "./operators"
import box from "./box"

export const api = path(function api(keys, ...args) {
    const key = last(keys)

    if (has(key, functions)) {
        return path(api, concat(apply(get(key, functions), args), drop(-1, keys)))
    }

    return resolve(concat(drop(-1, args), keys), last(args))
})

export const g = box(Object.assign({}, functions, { __, curry }))

export const obj = {
    app: { count: 0 }
}

// api.a
//     .concat(__, ["x", "y"])
//     .join(" * ")
//     .split(" * ")
//     .sortBy(api[0])
//     .map(api.toUpper())
//     .take(-3)
//     .reverse()
//     .assocPath(__, 10, {})
//     .as("foo")
//     .tap(api.foo.Y.X.set("C", api.inc()))
//     .log()({ a: ["a", "b", "c"] })
//
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
