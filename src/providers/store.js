export default store => {
    function StoreProvider(context) {
        context.store = store;
        context.select = target => target.select(context);
        context.get = target => target.get(context);
        context.set = target => target.set(context);

        return context;
    }

    return StoreProvider;
};
