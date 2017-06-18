import invoke from "./invoke"

export const join = invoke("join", ["delimiter", "target"])
export const push = invoke("push", ["value", "target"])
export const pop = invoke("pop", ["target"])
export const concat = invoke("concat", ["a", "b"])
export const filter = invoke("filter", ["fn", "target"])
export const sort = invoke("sort", ["fn", "target"])
//export const reduce = invoke(["fn", "initialValue", "target"], "reduce")

export const methods = {
    join: ["delimiter", "target"],
    push: ["value", "target"],
    pop: ["target"],
    concat: ["value", "functor"],
    filter: ["fn", "functor"],
    sort: ["fn", "functor"]
    //reduce: ["fn", "initialValue", "functor"],
    //indexOf: ["value", "target"]
}
