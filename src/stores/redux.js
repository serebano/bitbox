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
            run(path, action, props) {
                return this.dispatch(action, props);
            },
            dispatch(action, props) {
                return action(Object.assign({}, this, { props }));
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
