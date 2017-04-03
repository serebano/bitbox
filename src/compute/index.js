import is from "../utils/is";

const symbol = Symbol("bitbox.compute");

export function isCompute(arg) {
    return is.function(arg) && Reflect.has(arg, symbol);
}

function compute(...args) {
    function resolve(target) {
        return args.reduce(
            (result, arg, idx) => {
                if (idx === args.length - 1) {
                    if (is.path(arg)) return arg(target);
                    if (is.compute(arg)) return arg(target);
                    if (is.function(arg)) return arg(...result);

                    return arg;
                }
                if (is.path(arg)) return [...result, arg(target)];
                if (is.compute(arg)) return [...result, arg(target)];
                if (is.function(arg)) return [arg(...result)];

                return [...result, arg];
            },
            []
        );
    }

    resolve[symbol] = true;

    return resolve;
}

export default compute;
