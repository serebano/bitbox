import is from "./is"
import __ from "./__"
import box from "./box"
import arity from "./arity"
import path from "./path"
import curry from "./curry"
import curryN from "./curryN"
import partial from "./partial"
import ary, { unary, binary, ternary } from "./ary"
import * as operators from "./operators"
import * as dev from "./dev"
import * as fz from "./functions"
import resolve from "./resolve"
import * as observer from "./observer"
import R from "ramda"
import _ from "lodash/fp"

export { default as __ } from "./__"
export { default as is } from "./is"
export { default as ary } from "./ary"
export { default as arity } from "./arity"
export { default as path } from "./path"
export { default as curry } from "./curry"
export { default as curryN } from "./curryN"

export { default as fnz } from "./fnz"
export * from "./operators"

Object.assign(window, operators, dev, {
    is,
    dev,
    __,
    box,
    _,
    R,
    fz,
    ary,
    unary,
    binary,
    ternary,
    resolve,
    arity,
    curry,
    curryN,
    path,
    partial,
    observer,
    //observable,
    operators
})
