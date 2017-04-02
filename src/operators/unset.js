export default path => {
    return function unset(context) {
        return path(context, undefined);
    };
};
