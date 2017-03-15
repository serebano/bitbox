import Tag from "../Tag";
import Model from "../model";
import Devtools from "../Devtools";

import { State, Modules, Providers, Signals, Listeners } from "../models";
import { compute } from "../tags";

function Store(module, options) {
    const target = {};
    const devtools = options.devtools ? Devtools(options.devtools) : null;

    const api = {
        props: {},
        devtools,
        runTree(path, tree, props) {
            return dispatch(tree, props);
        }
    };
    const listeners = Listeners(target, "listeners", api);
    const providers = Providers(target, api);
    const state = State(target, api);
    const signals = Signals(target, api);

    api.state = state;
    api.signals = signals;
    api.providers = providers;

    const modules = Modules(target, api);

    function get(target, props) {
        return target.get({ ...api, props });
    }

    function select(target, props) {
        return target.select({
            ...api,
            props: props || {}
        });
    }

    function connect(map, listener) {
        const tag = compute(map);
        const paths = props => tag.paths({ state, signals, props }, ["state"]);
        const conn = listeners.connect(paths(), listener);

        return {
            get: props => get(tag, props),
            update: props => conn.update(paths(props)),
            remove: () => conn.remove()
        };
    }

    providers.add(function Props(context, action, props) {
        context.props = props || {};
        context.state = state;
        return context;
    });

    providers.add(function DispatchProvider(context, action, props) {
        context.get = (target, view) => target.get(context, view);
        context.select = target => target.select(context);
        return context;
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
        select,
        connect,
        dispatch,
        providers
    };
}

export default Store;
