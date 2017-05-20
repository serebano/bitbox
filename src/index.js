import is from "./is"
import box from "./box"
import observe from "./observe"
import observable from "./observable"
import project from "./project"
import run, { action } from "./run"
import bitbox from "./bitbox"
import factory from "./factory"
import resolve from "./resolve"
import * as operators from "./operators"
//import * as api from "./api/box"

Object.assign(bitbox, {
    factory,
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

Object.assign(window, operators, {
    bitbox,
    factory,
    project,
    resolve,
    observable,
    observe,
    box,
    run,
    is,
    action
})

export { is, box, observe, observable, project, run, action, factory, resolve, operators }

export default bitbox
/* ... */
