import Tag from "./Tag";
import Model from "./model";
// models
import Modules from "./models/modules";
import Signals from "./models/signals";
import State from "./models/state";
import Changes from "./models/changes";
import Providers from "./models/providers";
import Listeners from "./models/listeners";

// providers
import DebuggerProvider from "./providers/debugger";
import StoreProvider from "./providers/store";
import StateProvider from "./providers/state";
//
import Resolve from "./Resolve";
import Run from "./Run";
Store.init = (target, models = [Listeners, Changes, State]) =>
    models.reduce((obj, model) => Object.assign(obj, { [model.name]: model(target, obj) }), {});

function Store(module, store = {}) {
    const target = (store.target = {});
    const assign = props => Object.assign({}, store, { props: props || {} });

    store.listeners = Listeners(target);
    store.changes = Changes(target, store);

    Object.assign(store, {
        providers: Providers(target, store),
        state: State(target, store),
        signals: Signals(target, store),
        modules: Modules(target, store),
        resolve: Resolve(store),
        connect(target, listener, props) {
            store.changes.on(store.resolve.paths(target, ["state"], props), listener);
            listener.renew = props =>
                listener.update(store.resolve.paths(target, ["state"], props));

            return listener;
        },
        get(target, props) {
            if (!(target instanceof Tag)) throw new Error(`Invalid target: ${target}`);

            return target.get(assign(props));
        }
    });

    if (store.devtools) store.providers.add(DebuggerProvider(store));

    store.providers.add(StoreProvider(store));
    store.providers.add(StateProvider(store));

    store.fnTree = Run(store);

    store.modules.add(module);

    if (store.devtools) store.devtools.init(store.fnTree);

    return store;
}

export default Store;
