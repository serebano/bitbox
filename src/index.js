import bitbox from "./bitbox"
import * as factories from "./bitbox/factories"
import * as operators from "./operators"
import * as views from "./views"
import * as utils from "./utils"

export * from "./bitbox"

export { operators, factories, views, utils }

if (typeof window !== "undefined") {
    Object.assign(window, utils, operators, factories, {
        bitbox,
        factories,
        operators,
        views,
        utils
    })
}
