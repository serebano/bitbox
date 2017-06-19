import invoker from "./invoker"

export const join = invoker(2, "join")
export const push = invoker(2, "push")
export const pop = invoker(1, "pop")
export const concat = invoker(2, "concat")
export const filter = invoker(2, "filter")
export const sort = invoker(2, "sort")
