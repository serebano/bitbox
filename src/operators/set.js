export default (path, value) => {
    function set(context) {
        path(context, value);
    }

    //set.displayName = `set(${path.toString()}, ${value})`;

    return set;
};
