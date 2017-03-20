export default (path, arg) => {
    function inc(context) {
        context.apply(
            path,
            function inc(_, value) {
                return value;
            },
            arg
        );
    }

    inc.displayName = `inc(${path}, ${arg})`;

    return inc;
};
