export default (target, value) => {
    function set(context) {
        context.select(target).set(value);
    }

    set.displayName = `set(${target}, ${value})`;

    return set;
};
