import Model from "../Model";
import { State, Modules, Providers, Signals, Listeners } from "../models";

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
            run(path, tree, props) {
                return this.dispatch(tree, props);
            },
            dispatch(action, props) {
                action(Object.assign({}, this, { props }));
                this.flush();
            }
        }
    );

    store.modules.add(module);

    if (store.devtools) {
        store.devtools.init({
            model: store.state,
            on() {},
            emit() {}
        });
    }

    return {
        get: store.get,
        connect: store.connect,
        dispatch: store.dispatch
    };
}

export default Store;
