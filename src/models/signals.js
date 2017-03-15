import Model from "../model";

function Signals(target, store) {
    return Model(target, "signals", {
        add(path, tree) {
            function add(state, chain) {
                return props => store.runTree(path.join("."), chain, props || {});
            }

            return this.apply(path, add, tree);
        }
    });
}

export default Signals;
