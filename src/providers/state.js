export default store => {
    return function StateProvider(context) {
        let asyncTimeout;

        context.state = store.state.select(null, context);
        context.state.onChange = e => {
            if (context.debugger) {
                context.debugger.send({
                    type: "mutation",
                    method: e.method,
                    args: [e.path.slice(1), ...e.args]
                });
            }

            clearTimeout(asyncTimeout);
            asyncTimeout = setTimeout(() => store.flush());
        };

        return context;
    };
};
