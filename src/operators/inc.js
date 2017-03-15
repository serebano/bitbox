import { compute } from "../tags";

export default (target, value) => {
    function inc(context) {
        context.select(target).apply(
            compute(target, value, function inc(a = 0, b = 1) {
                return a + b;
            })
        );
    }

    return inc;
};
