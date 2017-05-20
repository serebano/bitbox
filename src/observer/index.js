import { proxies } from "./store"
import { is } from "../utils"

export function isObservable(object) {
    return is.complexObject(object) && proxies.get(object) === object
}
