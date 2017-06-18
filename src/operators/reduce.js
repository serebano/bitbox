import curry from "../curry"
import invoke from "./invoke"

export default invoke("reduce", ["fn", "initialValue", "target"])
// export default curry(function tail(arg) {
//     return Array.prototype.slice.call(arg, 1)
// })
