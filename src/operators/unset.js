export default target => {
    return function unset(context) {
        return context.select(target).unset();
    };
};
