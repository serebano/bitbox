import box from "../box"
import { _indexOf } from "./indexOf"

export default box(function contains(a, list) {
    return _indexOf(list, a, 0) >= 0
})
