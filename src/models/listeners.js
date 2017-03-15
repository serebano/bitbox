function Listeners(target = {}, path, store) {
    target.listeners = target.listeners || {};

    return {
        path,
        map: new WeakMap(),
        connect(paths, listener) {
            const model = this;

            if (model.map.has(listener)) return model.map.get(listener);

            const conn = {
                paths,
                name: listener.displayName || listener.name,
                add(paths) {
                    paths = conn.paths.concat(paths);
                    model.update(listener, conn.paths, paths);
                    if (store.devtools) store.devtools.updateComponentsMap(listener, paths);
                    conn.paths = paths;
                },
                update(paths) {
                    model.update(listener, conn.paths, paths);
                    if (store.devtools)
                        store.devtools.updateComponentsMap(listener, paths, conn.paths);
                    conn.paths = paths;
                },
                remove(paths) {
                    paths = paths || conn.paths;
                    model.remove(listener, paths);
                    if (store.devtools) store.devtools.updateComponentsMap(listener, null, paths);
                    conn.paths = conn.paths.filter(path => paths.indexOf(path) === -1);
                    if (!conn.paths.length) model.map.delete(listener);
                }
            };

            model.add(listener, paths);
            model.map.set(listener, conn);

            if (store.devtools) store.devtools.updateComponentsMap(listener, paths);

            return conn;
        },
        flush(force) {
            const start = Date.now();
            const changes = target.changes.flush();
            const listeners = this.get(changes, force);

            listeners.forEach(listener => {
                listener(changes);
                if (store.devtools) store.devtools.updateComponentsMap(listener);
            });

            if (store.devtools && listeners.length)
                store.devtools.sendComponentsMap(listeners, changes, start, Date.now());

            return { changes, listeners };
        },
        has(listener) {
            return this.map.has(listener);
        },
        add(entity, paths) {
            if (this.has(entity)) return;

            for (let path of paths) {
                path = path.split(".");

                path.reduce(
                    (currentMapLevel, key, index) => {
                        if (!currentMapLevel[key]) currentMapLevel[key] = {};

                        if (index < path.length - 1) {
                            currentMapLevel[key].children = currentMapLevel[key].children || {};

                            return currentMapLevel[key].children;
                        }

                        currentMapLevel[key].entities = currentMapLevel[key].entities
                            ? currentMapLevel[key].entities.concat(entity)
                            : [entity];

                        return currentMapLevel;
                    },
                    target.listeners
                );
            }
        },
        get(changes, all) {
            if (all) {
                const entities = [];

                function traverseChildren(children) {
                    for (const childKey in children) {
                        if (children[childKey].entities) {
                            for (let y = 0; y < children[childKey].entities.length; y++) {
                                if (entities.indexOf(children[childKey].entities[y]) === -1)
                                    entities.push(children[childKey].entities[y]);
                            }
                        }

                        if (children[childKey].children)
                            traverseChildren(children[childKey].children);
                    }
                }

                traverseChildren(target.listeners);

                return entities;
            }

            return this.match(changes).reduce(
                (unique, match) => {
                    return (match.entities || []).reduce(
                        (currentUnique, entity) => {
                            if (currentUnique.indexOf(entity) === -1)
                                return currentUnique.concat(entity);

                            return currentUnique;
                        },
                        unique
                    );
                },
                []
            );
        },
        remove(entity, paths) {
            for (let path of paths) {
                path = path.split(".");
                path.reduce(
                    (currentMapLevel, key, index) => {
                        if (index === path.length - 1) {
                            currentMapLevel[key].entities.splice(
                                currentMapLevel[key].entities.indexOf(entity),
                                1
                            );

                            if (!currentMapLevel[key].entities.length) {
                                delete currentMapLevel[key].entities;
                            }
                        }

                        return currentMapLevel[key].children;
                    },
                    target.listeners
                );
            }
        },
        update(entity, prevPaths, nextPaths) {
            const toRemove = prevPaths.filter(prevPath => nextPaths.indexOf(prevPath) === -1);
            const toAdd = nextPaths.filter(nextPath => prevPaths.indexOf(nextPath) === -1);

            if (toRemove.length) this.remove(entity, toRemove);

            if (toAdd.length) this.add(entity, toAdd);

            return {
                added: toAdd,
                removed: toRemove
            };
        },
        query(path, forceChildPathUpdates = false) {
            const changes = Array.isArray(path)
                ? path
                : [{ path: path.split("."), forceChildPathUpdates }];

            return this.match(changes).reduce(
                (unique, match) => {
                    return (match.entities || []).reduce(
                        (currentUnique, entity) => {
                            if (currentUnique.indexOf(entity) === -1)
                                return currentUnique.concat(entity);

                            return currentUnique;
                        },
                        unique
                    );
                },
                []
            );
        },
        match(changes) {
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
        }
    };
}

export default Listeners;
