import { compute } from "../tags";

export default (target, arg) => {
    const value = compute(target, arg, function extract(a = 0, b = 1) {
        return a - b;
    });

    function dec(context) {
        context.select(target).apply(value);
    }

    dec.displayName = `dec(${target}, ${arg})`;

    return dec;
};
