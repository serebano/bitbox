import create from "./create"
import curryX from "./curry.x"
import { getArgNames } from "../utils"

function curryTo(length, fn, args) {
    const argNames = args || getArgNames(fn)
    const next = curryX(fn, length, [], argNames, [], length)

    return create(length, next, fn, [], argNames)
}

export default curryTo
