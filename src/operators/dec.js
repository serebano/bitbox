import { compute } from "../tags";

export default (target, by) => {
    const value = compute(target, by, function dec(a = 0, b = 1) {
        return a - b;
    });

    function dec(context) {
        context.select(target).set(value);
    }

    return dec;
};
