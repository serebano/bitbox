import { is } from "../utils"

/**
 * Compute
 * bitbox(compute(1, 2, 3))
 * @param {Array} arguments
 */

function Compute(...args) {
    function compute(target) {
        return args.reduce((result, arg, idx) => {
            if (idx === args.length - 1)
                return is.box(arg) ? arg(target) : is.function(arg) ? arg(result) : arg

            return is.box(arg)
                ? [...result, arg(target)]
                : is.function(arg) ? [...result, arg(...result)] : [...result, arg]
        }, [])
    }

    return compute
}

export default Compute
