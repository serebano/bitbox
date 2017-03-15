import { compute } from "../tags";

export default (target, arg) => {
    const value = compute(target, arg, function minus(a = 0, b = 1) {
        return a - b;
    });

    return function dec(context) {
        context.select(target).apply(value);
    };
};
