import Model from "../model";

function State(target, store) {
    return Model(target, "state", {
        reset(state) {
            return this.update(
                function reset(target, key, data) {
                    target[key] = data;
                },
                null,
                state
            );
        },
        keys(path) {
            return this.get(path, function keys(target, key) {
                return Object.keys(target[key]);
            });
        },
        values(path) {
            return this.get(path, function values(target, key) {
                return Object.values(target[key]);
            });
        },
        push: Model.push,
        unshift: Model.unshift
    });
}

export default State;
