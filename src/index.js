import bitbox from "./bitbox"
import * as utils from "./utils"
import * as operators from "./operators"
import * as example from "./examples"

export default bitbox
export { operators, utils }

if (!utils.is.undefined(window)) {
    Object.assign(window, utils, operators, {
        bitbox,
        operators,
        utils
    })
}

//
// Object.assign(window, example)
