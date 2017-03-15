export default target => {
    return context => context.select(target).unset();
};
