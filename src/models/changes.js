import Path from "../model/path";

export default function Changes(target = {}, store) {
    const { listeners } = store;

    return {
        on(paths, listener) {
            paths = Array.isArray(paths) ? paths : [paths];
            listener.paths = (listener.paths || []).concat(paths);

            listener.add = paths => this.update(listener.paths.concat(paths), listener);
            listener.remove = paths => this.off(paths, listener);
            listener.update = paths => this.update(paths, listener);

            listeners.add(listener, paths);

            if (store.devtools) store.devtools.updateComponentsMap(listener, paths);

            return listener;
        },

        off(paths, listener) {
            paths = Array.isArray(paths) ? paths : [paths];
            listener.paths = listener.paths.filter(path => paths.indexOf(path) === -1);

            listeners.remove(listener, paths);

            if (store.devtools) store.devtools.updateComponentsMap(listener, null, paths);
        },

        update(newPaths, listener) {
            const oldPaths = listener.paths;
            listener.paths = newPaths;

            listeners.update(listener, oldPaths, newPaths);

            if (store.devtools) store.devtools.updateComponentsMap(listener, newPaths, oldPaths);
        },

        commit(force) {
            if (!force && !target.changes.length) return [];

            const start = Date.now();
            const _changes = target.changes.flush();
            const _listeners = listeners.get(_changes, force);

            _listeners.forEach(listener => {
                if (store.devtools) store.devtools.updateComponentsMap(listener);

                listener(_changes);
            });

            if (store.devtools && _listeners.length) {
                store.devtools.sendComponentsMap(_listeners, _changes, start, Date.now());
            }

            console.info(
                `[%c*%c]`,
                `color:red`,
                ``,
                `${_changes.length} (changes) * ${_listeners.length} (listeners)`
            );
            //console.info('[', changes.map(c => c.path.join(".")).join(", "), ']')
            if (_listeners.length)
                console.log(
                    _listeners
                        .map(
                            listener =>
                                `${listener.displayName || listener.name}/${listener.renderCount} [ ${listener.paths
                                    .filter(
                                        path =>
                                            _changes.filter(
                                                cpath => cpath.path.join(".") === path
                                            ).length
                                    )
                                    .join(", ")} ]`
                        )
                        .join("\n")
                );

            return _changes;
        },

        query(path, operator) {
            const keys = Path.keys(path);
            const length = keys.length;

            return keys.reduce(
                (changes, key, index) => {
                    let step = changes.filter(change => {
                        if (index === length - 1) {
                            if (key === "*") return change.path.length === length;
                            if (key === "**") return change.path.length >= length;
                            if (change.path[index] === key) return change.path.length === length;

                            return false;
                        }

                        return key === "*" || key === "**" || change.path[index] === key;
                    });

                    if (operator) step = step.filter(change => change.operator === operator);

                    console.log(
                        "\t".repeat(index),
                        index,
                        `${keys
                            .slice(0, index)
                            .join(".")}.( ${key} ).${keys.slice(index + 1).join(".")}`,
                        step.length
                    );
                    step.forEach(s =>
                        console.log(
                            "\t".repeat(index),
                            "-",
                            s.path.map((p, i) => i === index ? `( ${p} )` : p).join("."),
                            s.operator
                        ));

                    return step;
                },
                target.changes
            );
        }
    };
}
