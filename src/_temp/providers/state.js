export default store => {
    function State(context, action, props) {
        context.state = context.debugger
            ? store.state.select(null, context, action, props)
            : store.state;

        return context;
    }

    return State;
};
