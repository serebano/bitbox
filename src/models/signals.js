import Model from "../model";

function Signals(target, store) {
    return Model(target, {
        path: "signals",
        add(path, tree) {
            function add(target, key, chain) {
                target[key] = props => store.runTree(path.join("."), chain, props);
            }

            return this.update(add, path, tree);
        }
    });
}

export default Signals;
