export default (path, value) => {
    function set(context) {
        context.set(path, value);
    }

    set.displayName = `set(${path}, ${value})`;

    return set;
};
