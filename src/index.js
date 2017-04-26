import bitbox from "./bitbox"
import * as operators from "./bitbox/operators"
import * as factories from "./factories"
import * as views from "./views"
import * as utils from "./utils"

export default bitbox
export * from "./bitbox/operators"

export { operators, factories, views, utils }

if (!utils.is.undefined(window)) {
    Object.assign(window, utils, operators, factories, {
        bitbox,
        factories,
        operators,
        views,
        utils
    })
}
