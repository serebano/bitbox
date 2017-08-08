import is from "./is"
import __ from "./placeholder"
import box from "./box"
import arity from "./arity"
import path from "./path"
import curry from "./curry"
import curryN from "./curryN"
import partial from "./partial"
import ary, { unary, binary, ternary } from "./ary"
import * as operators from "./operators"
import * as dev from "./dev"
import resolve from "./resolve"
import * as observer from "./observer"
import R from "ramda"

export { default as __ } from "./__"
export { default as is } from "./is"
export { default as ary } from "./ary"
export { default as arity } from "./arity"
export { default as path } from "./path"
export { default as curry } from "./curry"
export { default as curryN } from "./curryN"

export * from "./operators"

Object.assign(window, operators, dev, {
    is,
    __,
    box,
    dev,
    R,
    ary,
    unary,
    binary,
    ternary,
    resolve,
    arity,
    curry,
    path,
    observer,
    //observable,
    operators
})
