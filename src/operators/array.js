import invoke from "./invoke"

export const join = invoke(["delimiter", "target"], "join")
export const push = invoke(["value", "target"], "push")
export const pop = invoke(["target"], "pop")
export const concat = invoke(["a", "b"], "concat")
export const filter = invoke(["fn", "target"], "filter")
export const sort = invoke(["fn", "target"], "sort")
export const reduce = invoke(["fn", "initialValue", "target"], "reduce")

export const methods = {
    join: ["delimiter", "target"],
    push: ["value", "target"],
    pop: ["target"],
    concat: ["value", "functor"],
    filter: ["fn", "functor"],
    sort: ["fn", "functor"],
    reduce: ["fn", "initialValue", "functor"],
    indexOf: ["value", "target"]
}
