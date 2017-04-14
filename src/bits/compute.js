import { is } from "../utils";

function compute(...args) {
    return function compute(target) {
        return args.reduce(
            (result, arg, idx) => {
                if (idx === args.length - 1) {
                    if (is.box(arg)) return arg(target);
                    if (is.function(arg)) return arg(...result);
                    return arg;
                }

                if (is.box(arg)) result.push(arg(target));
                else if (is.function(arg)) result.push(arg(...result));
                else result.push(arg);

                return result;
            },
            []
        );
    };
}

export default compute;
