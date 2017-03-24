export default (path, arg) => {
    return function inc(context) {
        path.set(context, arg, (a = 0, b = 1) => a + b);
    };
};
