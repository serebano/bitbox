import { FunctionTree, sequence, parallel } from "function-tree";

export { sequence, parallel };

function FunTree(store) {
    const funtree = new FunctionTree(store.providers.get());

    funtree.model = store.state;

    store.listeners.connect(["providers"], function FunTreeProviders() {
        funtree.contextProviders = store.providers.get();
    });

    funtree.flush = force => {
        const changes = store.flush(force);
        if (changes.length) funtree.emit("flush", changes, Boolean(force));
    };

    funtree.on("asyncFunction", (e, action) => !action.isParallel && funtree.flush());
    funtree.on("parallelStart", () => funtree.flush());
    funtree.on("parallelProgress", (e, payload, resolving) => resolving === 1 && funtree.flush());
    funtree.on("end", () => funtree.flush());

    if (store.devtools) {
        funtree.on("error", function throwErrorCallback(error) {
            if (Array.isArray(funtree._events.error) && funtree._events.error.length > 2)
                funtree.removeListener("error", throwErrorCallback);
            else
                throw error;
        });
    } else {
        funtree.on("error", function throwErrorCallback(error) {
            if (Array.isArray(funtree._events.error) && funtree._events.error.length > 1)
                funtree.removeListener("error", throwErrorCallback);
            else
                throw error;
        });
    }

    funtree.emit("initialized");

    return funtree;
}

export default FunTree;
