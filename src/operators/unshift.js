export default function(target, ...args) {
    function unshift(context) {
        context.select(target).apply(
            function unshift(array = [], ...values) {
                array.unshift(...values);

                return array;
            },
            args
        );
    }

    unshift.displayName = `unshift(${Array.prototype.join.call(arguments, ", ")})`;

    return unshift;
}
