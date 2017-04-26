import { is } from "../../utils"
import bitbox from "../"

/**
 * Compute
 * bitbox(compute(1, 2, 3))
 * @param {Array} arguments
 */

function Compute(...args) {
    function compute(target) {
        return args.reduce((result, arg, idx) => {
            if (idx === args.length - 1)
                return is.box(arg) ? bitbox.get(target, arg) : is.func(arg) ? arg(result) : arg

            return is.box(arg)
                ? [...result, bitbox.get(target, arg)]
                : is.func(arg) ? [...result, arg(...result)] : [...result, arg]
        }, [])
    }

    return compute
}

export default Compute
