import bitbox from "./bitbox"
import * as factories from "./bitbox/factories"
import * as operators from "./operators"
import * as views from "./views"
import * as utils from "./utils"
import * as e from "./examples/depless"

export default bitbox
export * from "./bitbox/factories"
export { operators, factories, utils }

if (typeof window !== "undefined") {
    Object.assign(window, utils, operators, factories, e, {
        bitbox,
        factories,
        operators,
        views,
        utils
    })
}
