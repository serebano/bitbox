import Model from "../model";

function Signals(target, store) {
    return Model(target, {
        path: "signals",
        add(path, chain) {
            return this.apply(
                path,
                function add(target, key, chain) {
                    target[key] = props => {
                        store.fnTree.runTree(path.join("."), chain, props);
                    };
                },
                chain
            );
        }
    });
}

export default Signals;
