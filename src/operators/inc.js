import { compute } from "../tags";

export default (target, arg) => {
    const value = compute(target, arg, function add(a = 0, b = 1) {
        return a + b;
    });

    return function inc(context) {
        context.select(target).apply(value);
    };
};
