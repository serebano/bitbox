import bitbox from "./bitbox"
import * as operators from "./operators"
import { is } from "./utils"
import * as example from "./examples"

export default bitbox

Object.assign(window, operators, {
    is,
    bitbox,
    operators
})

Object.assign(window, example)
