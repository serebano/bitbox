export default function(path, ...args) {
    function push(tree) {
        tree.apply(
            path,
            function push(array = [], ...values) {
                array.push(...values);

                return array;
            },
            ...args
        );
    }

    push.displayName = `push(${Array.prototype.join.call(arguments, ", ")})`;

    return push;
}
