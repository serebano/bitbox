import is from "../is";

class Compute {
    static get(target, ...args) {
        if (!args.length) return;

        let [value, ...rest] = args;
        if (is.path(value)) value = value(target);
        if (is.compute(value)) value = value.get(target);

        if (!rest.length) return value;

        return rest.reduce(
            (result, arg, idx, args) => {
                if (idx === args.length - 1) {
                    if (is.path(arg)) return arg(target);
                    if (is.compute(arg)) return arg.get(target);
                    if (is.function(arg)) return arg(...result);
                    return arg;
                }
                if (is.path(arg)) return result.concat(arg(target));
                if (is.compute(arg)) return result.concat(arg.get(target));
                if (is.function(arg)) return [arg(...result)];

                return result.concat(arg);
            },
            [value]
        );
    }

    constructor() {
        this.args = Array.from(arguments);
    }

    get(target) {
        return Compute.get(target, ...this.args);
    }
}

export default Compute;
