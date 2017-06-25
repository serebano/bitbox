import invoker from "./invoker"

export const join = invoker(1, "join")
export const split = invoker(1, "split")
export const push = invoker(1, "push")
export const pop = invoker(0, "pop")
export const concat = invoker(1, "concat")
export const filter = invoker(1, "filter")
export const sort = invoker(1, "sort")
