import bitbox from "./bitbox"
export * from "./bitbox"
//import * as api from "./api/get"
export default bitbox
if (typeof window !== "undefined") {
    Object.assign(window, bitbox, {
        bitbox
    })
}
