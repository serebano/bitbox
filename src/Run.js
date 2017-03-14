import { FunctionTree } from "function-tree";

function Run(store) {
    const functionTree = new FunctionTree(store.providers.get());

    functionTree.model = store.state;

    store.changes.on("providers", function UpdateProviders(changes) {
        const newProviders = store.providers.get();
        functionTree.contextProviders = newProviders;
    });

    functionTree.flush = force => {
        const changes = store.changes.commit(force);
        if (changes.length) functionTree.emit("flush", changes, Boolean(force));
    };

    functionTree.on("asyncFunction", (e, action) => !action.isParallel && functionTree.flush());
    functionTree.on("parallelStart", () => functionTree.flush());
    functionTree.on(
        "parallelProgress",
        (e, payload, resolving) => resolving === 1 && functionTree.flush()
    );
    functionTree.on("end", () => functionTree.flush());

    if (store.devtools) {
        functionTree.on("error", function throwErrorCallback(error) {
            if (Array.isArray(functionTree._events.error) && functionTree._events.error.length > 2)
                functionTree.removeListener("error", throwErrorCallback);
            else
                throw error;
        });
    } else {
        functionTree.on("error", function throwErrorCallback(error) {
            if (Array.isArray(functionTree._events.error) && functionTree._events.error.length > 1)
                functionTree.removeListener("error", throwErrorCallback);
            else
                throw error;
        });
    }

    functionTree.emit("initialized");

    return functionTree;
}

export default Run;
