import { ensurePath, dependencyMatch } from '../utils'

class DependencyStore {

    constructor() {
        this.map = {}
        this.keys = {}
        this.changes = []
    }

    /*
      Adds the entity to all the depending paths
    */
    add(entity, depsMap) {
        for (const depsMapKey in depsMap) {
            const path = depsMapKey.split('.')

            path.reduce((currentMapLevel, key, index) => {
                if (!currentMapLevel[key]) {
                    currentMapLevel[key] = {}
                }

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

        return () => this.remove(entity, depsMap)
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
    remove(entity, depsMap) {
        for (const depsMapKey in depsMap) {
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
    update(entity, prevDepsMap, nextDepsMap) {
        const toRemove = Object.keys(prevDepsMap).reduce((removeDepsMap, prevDepsMapKey) => {
            if (!nextDepsMap[prevDepsMapKey]) {
                removeDepsMap[prevDepsMapKey] = true
            }

            return removeDepsMap
        }, {})
        const toAdd = Object.keys(nextDepsMap).reduce((addDepsMap, nextDepsMapKey) => {
            if (!prevDepsMap[nextDepsMapKey]) {
                addDepsMap[nextDepsMapKey] = true
            }

            return addDepsMap
        }, {})

        this.remove(entity, toRemove)
        this.add(entity, toAdd)

        return [ toRemove, toAdd ]
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
		const keys = this.keys

		this.changes = []
		this.keys = {}

		const components = force
			? this.getAll()
			: this.get(changes)

		components.forEach((component) => {
            component(changes)
		})

		return { keys, changes, components, force }
	}

    emit(path) {
		this.push(path)

		return this.commit()
	}
}

export default DependencyStore
