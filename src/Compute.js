import is from "./is";
import box from "./box";

class Compute {
    static get(target, args) {
        if (!args || !args.length) return;

        let [value, ...rest] = args;
        value = is.path(value) || is.compute(value) ? value.get(target) : value;

        if (!rest.length) return value;

        return rest.reduce(
            (result, arg, idx, args) => {
                if (idx === args.length - 1) {
                    if (is.function(arg)) return arg(...result);
                    if (is.path(arg) || is.compute(arg)) return arg.get(target);
                    return arg;
                }
                if (is.path(arg) || is.compute(arg)) return result.concat(arg.get(target));
                if (is.function(arg)) return [arg(...result)];

                return result.concat(arg);
            },
            [value]
        );
    }

    constructor(...args) {
        this.args = args;
    }

    get(target) {
        return Compute.get(target, this.args);
    }

    box(target, func) {
        return box(func, this, target);
    }
}

export default Compute;
