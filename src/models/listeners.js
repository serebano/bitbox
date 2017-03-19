import Path from "../Path";
import Changes from "./changes";

const Listener = {
    changes(target) {
        return target.changes || (target.changes = new Changes(target.changes));
    },

    connect(target, paths, listener) {
        const conn = {
            paths,

            name: listener.displayName || listener.name,

            add(paths) {
                paths = conn.paths.concat(paths);
                Listener.update(listener, conn.paths, paths);
                //if (tree.devtools) tree.devtools.updateComponentsMap(listener, paths);
                conn.paths = paths;
            },

            update(paths) {
                Listener.update(listener, conn.paths, paths);
                //if (tree.devtools) tree.devtools.updateComponentsMap(listener, paths, conn.paths);
                conn.paths = paths;
            },

            remove(paths) {
                paths = paths || conn.paths;
                Listener.remove(listener, paths);
                //if (tree.devtools) tree.devtools.updateComponentsMap(listener, null, paths);
                conn.paths = conn.paths.filter(path => paths.indexOf(path) === -1);
            }
        };

        Listener.add(target, paths, listener);

        //if (tree.devtools) tree.devtools.updateComponentsMap(listener, paths);

        return conn;
    },

    flush(target, force) {
        const start = Date.now();
        const changes = target.changes.flush();
        const listeners = Listener.get(target, changes, force);

        listeners.forEach(listener => {
            listener(changes);
            //if (tree.devtools) tree.devtools.updateComponentsMap(listener);
        });

        //if (tree.devtools && listeners.length)
        //    tree.devtools.sendComponentsMap(listeners, changes, start, Date.now());

        return { changes, listeners };
    },

    add(target, paths, listener) {
        target.listeners = target.listeners || {};
        target.changes = new Changes(target.changes);

        for (let path of paths) {
            Path.keys(path).reduce(
                (currentMapLevel, key, index, path) => {
                    if (!currentMapLevel[key]) currentMapLevel[key] = {};

                    if (index < path.length - 1) {
                        currentMapLevel[key].children = currentMapLevel[key].children || {};

                        return currentMapLevel[key].children;
                    }

                    currentMapLevel[key].listeners = currentMapLevel[key].listeners
                        ? currentMapLevel[key].listeners.concat(listener)
                        : [listener];

                    return currentMapLevel;
                },
                target.listeners
            );
        }
    },

    get(target, changes) {
        if (!changes) {
            const listeners = [];
            function traverseChildren(children) {
                for (const childKey in children) {
                    if (children[childKey].listeners) {
                        for (let y = 0; y < children[childKey].listeners.length; y++) {
                            if (listeners.indexOf(children[childKey].listeners[y]) === -1)
                                listeners.push(children[childKey].listeners[y]);
                        }
                    }

                    if (children[childKey].children) traverseChildren(children[childKey].children);
                }
            }
            traverseChildren(target.listeners);

            return listeners;
        }

        return this.match(target, changes).reduce(
            (unique, match) => {
                return (match.listeners || []).reduce(
                    (currentUnique, listener) => {
                        if (currentUnique.indexOf(listener) === -1)
                            return currentUnique.concat(listener);

                        return currentUnique;
                    },
                    unique
                );
            },
            []
        );
    },

    remove(target, paths, listener) {
        for (let path of paths) {
            Path.keys(path).reduce(
                (currentMapLevel, key, index, path) => {
                    if (index === path.length - 1) {
                        currentMapLevel[key].listeners.splice(
                            currentMapLevel[key].listeners.indexOf(listener),
                            1
                        );

                        if (!currentMapLevel[key].listeners.length) {
                            delete currentMapLevel[key].listeners;
                        }
                    }

                    return currentMapLevel[key].children;
                },
                target.listeners
            );
        }
    },

    update(target, prevPaths, nextPaths, listener) {
        const toRemove = prevPaths.filter(prevPath => nextPaths.indexOf(prevPath) === -1);
        const toAdd = nextPaths.filter(nextPath => prevPaths.indexOf(nextPath) === -1);

        if (toRemove.length) this.remove(target, toRemove, listener);
        if (toAdd.length) this.add(target, toAdd, listener);

        return {
            added: toAdd,
            removed: toRemove
        };
    },

    match(target, changes) {
        let dependencyMap = target.listeners;
        let currentMatches = [];

        function extractAllChildMatches(children) {
            return Object.keys(children).reduce(
                (matches, key) => {
                    if (children[key].children)
                        return matches
                            .concat(children[key])
                            .concat(extractAllChildMatches(children[key].children));

                    return matches.concat(children[key]);
                },
                []
            );
        }

        for (let changeIndex = 0; changeIndex < changes.length; changeIndex++) {
            let currentDependencyMapLevel = dependencyMap;

            for (
                let pathKeyIndex = 0;
                pathKeyIndex < changes[changeIndex].path.length;
                pathKeyIndex++
            ) {
                if (!currentDependencyMapLevel) {
                    break;
                }

                if (currentDependencyMapLevel["**"]) {
                    currentMatches.push(currentDependencyMapLevel["**"]);
                }

                if (pathKeyIndex === changes[changeIndex].path.length - 1) {
                    const dependency = currentDependencyMapLevel[
                        changes[changeIndex].path[pathKeyIndex]
                    ];

                    if (dependency) {
                        currentMatches.push(dependency);

                        if (dependency.children) {
                            if (changes[changeIndex].forceChildPathUpdates) {
                                currentMatches = currentMatches.concat(
                                    extractAllChildMatches(dependency.children)
                                );
                            } else {
                                if (dependency.children["**"]) {
                                    currentMatches.push(dependency.children["**"]);
                                }

                                if (dependency.children["*"]) {
                                    currentMatches.push(dependency.children["*"]);
                                }
                            }
                        }
                    }

                    if (currentDependencyMapLevel["*"]) {
                        currentMatches.push(currentDependencyMapLevel["*"]);
                    }
                }

                if (!currentDependencyMapLevel[changes[changeIndex].path[pathKeyIndex]]) {
                    currentDependencyMapLevel = null;
                    break;
                }

                currentDependencyMapLevel = currentDependencyMapLevel[
                    changes[changeIndex].path[pathKeyIndex]
                ].children;
            }
        }

        return currentMatches;
    },

    clear(target) {
        target.listeners = {};
        return target.changes.flush();
    }
};

export function Listen(target = {}) {
    target.listeners = target.listeners || {};
    target.changes = new Changes(target.changes);

    return target;
}

export default Listener;
