//import Tag from "./Tag";
import Model from "./Model";
// models
import Providers from "./models/providers";
import Listeners from "./models/listeners";
import Modules from "./models/modules";
import Signals from "./models/signals";
import State from "./models/state";
// providers
import DebuggerProvider from "./providers/debugger";
import StoreProvider from "./providers/store";
import StateProvider from "./providers/state";
// FunctionTree
import Run from "./Run";

function Store(module) {
    const store = Model.create(
        {
            listeners: Listeners,
            providers: Providers,
            state: State,
            signals: Signals,
            modules: Modules
        },
        {
            props: {},
            runTree(path, tree, props) {
                return store.fnTree.runTree(path, tree, props);
            }
        }
    );

    //store.modules.add(module);

    if (store.devtools) store.providers.add(DebuggerProvider(store));

    store.providers.add(StoreProvider(store));
    store.providers.add(StateProvider(store));

    store.fnTree = Run(store);

    store.modules.add(module);

    if (store.devtools) store.devtools.init(store.fnTree);

    return store;
}

export default Store;
