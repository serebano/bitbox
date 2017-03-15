export default store => {
    return function StoreProvider(context) {
        context.get = target => target.get(context);
        context.select = target => target.select(context);

        return context;
    };
};
