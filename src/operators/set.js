export default (target, value) => {
    function set(context) {
        context.select(target).set(value);
    }

    return set;
};
