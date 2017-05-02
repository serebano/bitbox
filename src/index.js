import bitbox from "./bitbox"
import * as operators from "./operators"
import * as utils from "./utils"
import * as api from "./api"

export default bitbox
export * from "./operators"
export { operators, utils }

if (typeof window !== "undefined") {
    Object.assign(window, utils, operators, {
        bitbox,
        operators,
        utils,
        api
    })
}
