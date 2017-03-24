export default path => {
    return function unset(context) {
        return path.set(context, undefined);
    };
};
