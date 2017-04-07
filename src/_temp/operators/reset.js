export default (target, value) => {
    function set(context) {
        context.select(target).apply(
            function reset(_, value) {
                return value;
            },
            value
        );
    }

    return set;
};
