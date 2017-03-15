import Model from "./Model";
// models
import Providers from "./models/providers";
import Listeners from "./models/listeners";
import Modules from "./models/modules";
import Signals from "./models/signals";
import State from "./models/state";
// FunctionTree
import FunTree from "./Run";

function Store(module) {
    const store = Model.create(
        {
            providers: Providers,
            listeners: Listeners,
            signals: Signals,
            modules: Modules,
            state: State,
            funtree(target, path, api) {
                api.funtree = FunTree(api);
                return;
            }
        },
        {
            props: {},
            run() {
                return store.funtree.runTree(...arguments);
            }
        }
    );

    store.modules.add(module);

    return {
        get: store.get,
        run: store.run,
        connect: store.connect
    };
}

export default Store;
