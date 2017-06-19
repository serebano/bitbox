import is from "./is"
import __ from "./__"
import arity from "./arity"
import path from "./path"
import curry, { curryN } from "./curry"
import partial from "./partial"
import ary, { unary, binary, ternary } from "./ary"
import * as functions from "./functions"
import * as dev from "./dev"
import * as fnz from "./fnz"

export { default as __ } from "./__"
export { default as is } from "./is"
export { default as ary } from "./ary"
export { default as arity } from "./arity"
export { default as path } from "./path"
export { default as curry } from "./curry"
export { curryN } from "./curry"

export { default as fnz } from "./fnz"
export * from "./functions"

Object.assign(window, functions, dev, {
    is,
    dev,
    __,
    fnz,
    ary,
    unary,
    binary,
    ternary,
    arity,
    curry,
    curryN,
    path,
    partial,
    functions
})
