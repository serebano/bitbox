import is from "../utils/is";

Compute.args = Symbol("bitbox.args");
Compute.compute = Symbol("bitbox.compute");
Compute.isCompute = arg => is.function(arg) && Reflect.has(arg, Compute.compute);

function Compute(...args) {
    function compute(target) {
        return args.reduce(
            (result, arg, idx) => {
                if (idx === args.length - 1) {
                    if (is.path(arg) || is.compute(arg)) return arg(target);
                    if (is.function(arg)) return arg(...result);

                    return arg;
                }

                if (is.path(arg) || is.compute(arg)) result.push(arg(target));
                else if (is.function(arg)) result.push(arg(...result));
                else result.push(arg);

                return result;
            },
            []
        );
    }

    compute[Compute.args] = args;
    compute[Compute.compute] = true;

    return compute;
}

export default Compute;
