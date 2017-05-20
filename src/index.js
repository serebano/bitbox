import is from "./is"
import box from "./box"
import observe from "./observe"
import observable from "./observable"
import project from "./project"
import run, { action } from "./run"
import bitbox from "./bitbox"
import create from "./create"
import resolve from "./resolve"

import * as operators from "./operators"

import * as api from "./api/box"

Object.assign(bitbox, {
    create,
    project,
    resolve,
    observable,
    observe,
    box,
    run,
    action,
    is,
    operators
})

Object.assign(window, operators, api, {
    bitbox,
    create,
    project,
    resolve,
    observable,
    observe,
    box,
    run,
    action
})

export default bitbox
/* ... */
