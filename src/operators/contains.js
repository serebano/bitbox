import curry from "../curry"
import { _indexOf } from "./indexOf"

export default curry(function contains(a, list) {
    return _indexOf(list, a, 0) >= 0
})
