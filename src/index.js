import bitbox from "./bitbox"
import * as utils from "./utils"
import * as operators from "./operators"
import * as example from "./examples"
import * as handler from "./bitbox"

export default bitbox
export { operators, utils }

if (!utils.is.undefined(window)) {
    Object.assign(window, utils, operators, handler, {
        bitbox,
        handler,
        operators,
        utils
    })
    Object.assign(window, example)
}
