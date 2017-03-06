import { dependencyMatch } from './utils'

class Changes {

    static match = dependencyMatch

    constructor() {
        this.map = {}
    }

    /*
      Adds the entity to all the depending paths
    */
    add(entity, paths) {
        for (const depsMapKey of paths) {
            const path = depsMapKey.split('.')

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
    }

    /*
      Returns entities based on a change map returned from
      the model flush method.
    */
    getListeners(changes) {
        return dependencyMatch(changes, this.map).reduce((unique, match) => {
            return (match.entities || []).reduce((currentUnique, entity) => {
                if (currentUnique.indexOf(entity) === -1)
                    return currentUnique.concat(entity)

                return currentUnique
            }, unique)
        }, [])
    }

    /*
      As same entity can appear in multiple paths, this method returns
      all unique entities. Used by view to render all components
    */
    getAllListeners() {
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
      Removes the entity from all depending paths
    */
    remove(entity, paths) {
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

        if (toRemove.length)
            this.remove(entity, toRemove)

        if (toAdd.length)
            this.add(entity, toAdd)

        return {
            added: toAdd,
            removed: toRemove
        }
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

}

export default Changes
