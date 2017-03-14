import Model from "../model";

function State(target, store) {
    return Model(target, {
        path: "state",
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
            return this.extract(
                function keys(target, key) {
                    return Object.keys(target[key]);
                },
                path
            );
        },
        values(path) {
            return this.extract(
                function values(target, key) {
                    return Object.values(target[key]);
                },
                path
            );
        },
        push() {
            return this.update(
                function push(target, key, ...values) {
                    if (!(key in target)) target[key] = [];

                    target[key].push(...values);
                },
                ...arguments
            );
        }
    });
}

export default State;
