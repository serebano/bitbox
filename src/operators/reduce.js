import curry from "../curry"
import invoke from "./invoke"

export default invoke(["fn", "initialValue", "target"], "reduce")
// export default curry(function tail(arg) {
//     return Array.prototype.slice.call(arg, 1)
// })
