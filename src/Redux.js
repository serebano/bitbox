import Tag from "./Tag";
import Model from "./model";
import { State, Modules, Providers, Signals, Listeners } from "./models";
import { compute } from "./tags";
import Devtools from "./Devtools";

function Store(module, options) {
    const target = {};
    const devtools = options.devtools ? Devtools(options.devtools) : null;

    const providers = Providers(target);
    const listeners = Listeners(target, { devtools });
    const state = State(target);
    const signals = Signals(target, {
        runTree(path, tree, props) {
            return dispatch(tree, props);
        }
    });
    const modules = Modules(target, { state, signals, providers });

    function get(tag, props) {
        return tag.get({
            props,
            state,
            modules,
            signals
        });
    }

    function connect(map, listener) {
        const tag = compute(map);
        const paths = props => tag.paths({ state, signals, props }, ["state"]);
        const conn = listeners.connect(listener, paths());

        return {
            get: props => get(tag, props),
            update: props => conn.update(paths(props)),
            remove: () => conn.remove()
        };
    }

    providers.add(function DispatchProvider(context, action, props = {}) {
        return {
            props,
            state,
            model: tag => tag.model(context)
        };
    });

    function dispatch(action, props) {
        action(providers.create(action, props));
        listeners.flush();
    }

    modules.add(module);

    if (devtools)
        devtools.init({
            model: state,
            on() {},
            emit() {}
        });

    return {
        get,
        connect,
        dispatch,
        providers
    };
}

export default Store;
