import is from "./is"
import bitbox, { box } from "./bitbox"
import observable from "./observable"
import observe from "./observe"
import project from "./project"
import run, { action } from "./run"
import create from "./create"
import resolve from "./resolve"

import * as operators from "./operators"

import * as api from "./api/map.2"

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
