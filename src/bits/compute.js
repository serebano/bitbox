import { is, toPrimitive } from "../utils";

function compute(...args) {
    function compute(target) {
        return args.reduce(
            (result, arg, idx) => {
                if (idx === args.length - 1)
                    return is.box(arg) ? arg(target) : is.function(arg) ? arg(result) : arg;

                return is.box(arg)
                    ? [...result, arg(target)]
                    : is.function(arg) ? [...result, arg(...result)] : [...result, arg];
            },
            []
        );
    }

    compute.displayName = `compute(${toPrimitive(args)})`;

    return compute;
}

export default compute;
