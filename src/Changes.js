import { ensurePath, dependencyMatch } from './utils'

class Changes {

    static match = dependencyMatch

    keys = {}
    changes = []
    paths = []

    constructor(map = {}) {
        this.map = map
    }

    on(context, target, fn) {
        const conn = this.add(fn, ...target.paths(context))

        conn.update = (context) => {
            const newPaths = target.paths(context)
            const oldPaths = conn.paths

            conn.paths = newPaths

            return this.update(fn, oldPaths, newPaths)
        }

        return conn
    }


    /*
      Adds the entity to all the depending paths
    */
    add(entity, ...paths) {
        for (const depsMapKey of paths) {
            const path = depsMapKey.split('.')

            if (this.paths.indexOf(depsMapKey) === -1)
                this.paths.push(depsMapKey)

            path.reduce((currentMapLevel, key, index) => {
                if (!currentMapLevel[key])
                    currentMapLevel[key] = {}

                if (index < path.length - 1) {
                    currentMapLevel[key].children = currentMapLevel[key].children || {}

                    return currentMapLevel[key].children
                }

                currentMapLevel[key].entities = currentMapLevel[key].entities
                    ? currentMapLevel[key].entities.concat(entity)
                    : [entity]

                return currentMapLevel
            }, this.map)
        }

        const connection = { paths }

        connection.remove = () => {
            this.remove(entity, ...connection.paths)
            connection.paths = []
        }

        connection.update = (newPaths) => {
            const oldPaths = connection.paths
            connection.paths = newPaths

            return this.update(entity, oldPaths, newPaths)
        }

        return connection
    }

    /*
      Returns entities based on a change map returned from
      the model flush method.
    */
    get(changesMap) {
        changesMap = changesMap || this.changes

        return dependencyMatch(changesMap, this.map).reduce((unique, match) => {
            return (match.entities || []).reduce((currentUnique, entity) => {
                if (currentUnique.indexOf(entity) === -1) {
                    return currentUnique.concat(entity)
                }

                return currentUnique
            }, unique)
        }, [])
    }

    /*
      Removes the entity from all depending paths
    */
    remove(entity, ...paths) {
        for (const depsMapKey of paths) {
            const path = depsMapKey.split('.')
            path.reduce((currentMapLevel, key, index) => {
                if (index === path.length - 1) {
                    currentMapLevel[key].entities.splice(currentMapLevel[key].entities.indexOf(entity), 1)

                    if (!currentMapLevel[key].entities.length) {
                        delete currentMapLevel[key].entities
                    }
                }

                return currentMapLevel[key].children
            }, this.map)
        }
    }
    /*
      Updates entity based on changed dependencies
    */
    update(entity, prevPaths, nextPaths) {
        const toRemove = prevPaths.filter(prevPath => nextPaths.indexOf(prevPath) === -1)
        const toAdd = nextPaths.filter(nextPath => prevPaths.indexOf(nextPath) === -1)

        this.remove(entity, ...toRemove)
        this.add(entity, ...toAdd)

        return {
            added: toAdd,
            removed: toRemove
        }
    }
    /*
      As same entity can appear in multiple paths, this method returns
      all unique entities. Used by view to render all components
    */
    getAll() {
        const entities = []

        function traverseChildren(children) {
            for (const childKey in children) {
                if (children[childKey].entities) {
                    for (let y = 0; y < children[childKey].entities.length; y++) {
                        if (entities.indexOf(children[childKey].entities[y]) === -1) {
                            entities.push(children[childKey].entities[y])
                        }
                    }
                }

                return traverseChildren(children[childKey].children)
            }
        }

        traverseChildren(this.map)

        return entities
    }
    /*
      Converts the changes map from "flush" to an array of paths
    */
    convertChangeMap(currentLevel, details = {
        currentPath: [],
        allPaths: []
    }) {
        Object.keys(currentLevel).forEach((key) => {
            details.currentPath.push(key)
            if (currentLevel[key] === true) {
                details.allPaths.push(details.currentPath.join('.'))
            } else {
                this.convertChangeMap(currentLevel[key], details)
            }
            details.currentPath.pop()
        })

        return details.allPaths
    }

    push(path, forceChildPathUpdates = false) {
        path = ensurePath(path)

		if (path in this.keys)
			return this.keys[path]

		this.keys[path] = this.changes.push({ path, forceChildPathUpdates }) - 1

		if (this.keys[path] >= 10)
			console.warn(`(deps) ${this.keys[path]} uncommited changes`)

		return this.keys[path]
	}

    commit(force) {

		const changes = this.changes

		this.changes = []
		this.keys = {}

		const components = force
			? this.getAll()
			: this.get(changes)

		components.forEach((component) => {
            component(changes)
		})

		return components
	}

    emit(...paths) {
		paths.forEach(path => {
            this.push(path)
        })

		return this.commit()
	}
}

export default Changes
