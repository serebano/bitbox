import { ensurePath, dependencyMatch } from './utils'

class Changes {

    static match = dependencyMatch

    keys = {}
    changes = []

    constructor({ devtools }) {
        this.map = {}
        this.devtools = devtools
    }

    connect(paths, entity) {

        const connection = { entity, paths }

        connection.add = (...paths) => this.add(entity, ...paths)
        connection.remove = (...paths) => this.remove(entity, ...paths)

        connection.update = (newPaths) => {
            const oldPaths = connection.paths
            connection.paths = newPaths

            this.update(entity, oldPaths, newPaths)

            if (this.devtools)
                this.devtools.updateComponentsMap(entity, newPaths, oldPaths)
        }

        connection.remove = () => {
            const paths = connection.paths

            this.remove(entity, ...paths)

            if (this.devtools)
                this.devtools.updateComponentsMap(entity, null, paths)

            connection.paths = []
        }

        // add
        this.add(entity, ...paths)

        if (this.devtools)
            this.devtools.updateComponentsMap(entity, paths)
            //this.devtools.updateComponentsMap(entity, paths.reduce((map, path) => { map[path] = true; return map }, {}))

        return connection
    }

    /*
      Adds the entity to all the depending paths
    */
    add(entity, ...paths) {
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

    on(path, entity) {
        const conn = this.connect([ path ], entity)

        return conn
    }

    get(path, operator) {
        const keys = ensurePath(path)
        const length = keys.length
        //console.log(`get(${path})`, operator)

        return keys.reduce((changes, key, index) => {
            let step = changes.filter(change => {
                if (index === length - 1) {
                    if (key === "*")
                        return change.path.length === length
                    if (key === "**")
                        return change.path.length >= length
                    if (change.path[index] === key)
                        return change.path.length === length

                    return false
                }

                return key === "*" || key === "**" || change.path[index] === key
            })

            if (operator)
                step = step.filter(change => change.operator === operator)

            console.log("\t".repeat(index), index, `${keys.slice(0, index).join(".")}.( ${key} ).${keys.slice(index+1).join(".")}`, step.length)
            step.forEach(s => console.log("\t".repeat(index), '-', s.path.map((p,i) => i === index ? `( ${p} )` : p).join("."), s.operator))

            return step

        }, this.changes)
    }

    /*
      Returns entities based on a change map returned from
      the model flush method.
    */
    getListeners() {
        return dependencyMatch(this.changes, this.map).reduce((unique, match) => {
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

        if (toRemove.length)
            this.remove(entity, ...toRemove)

        if (toAdd.length)
            this.add(entity, ...toAdd)

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

    push({ type, path, operator, forceChildPathUpdates = false }) {

        path = [type].concat(path)

        const key = operator + ":" + path.join(".")

		if (key in this.keys)
			return this.keys[key]

		this.keys[key] = this.changes.push({ type, path, operator, forceChildPathUpdates, index: this.changes.length })

		if (this.keys[key] >= 50) {
			console.warn(`(deps) ${this.keys[key]} uncommited changes`)
        }

        this.debug(...arguments, this.keys[key])

		return this.keys[key]
	}

    debug(e, index) {
        const args = ["%c'"+(e.path.join(".")||".")+"'%c"].concat(e.args).map(arg => {
            if (typeof arg === "function")
                return (arg.displayName || arg.name) || String(arg)
            if (typeof arg === "object")
                return JSON.stringify(arg)
            return String(arg)
        }).join(", ")

        if (e.action)
            console.log(`[${index}] ${e.action.name}`, e.action)

        console.log(`[${index}] %c${e.type}%c.%c${e.operator}%c(${args}%c)`, `color:#e5c07b`, `color:#abb2bf`, `color:#61afef`, `color:#abb2bf`, `color:#98c379`, `color:#5c6370`, 'color:#abb2bf')

    }

    commit(force) {
        if (!force && !this.changes.length)
            return []

        const start = Date.now()
		const changes = this.changes
		const listeners = force
            ? this.getAllListeners()
            : this.getListeners()

		listeners.forEach((listener) => {
            if (this.devtools)
                this.devtools.updateComponentsMap(listener)

            listener(changes)
		})

        this.changes = []
    	this.keys = {}

        if (this.devtools && listeners.length)
            this.devtools.sendComponentsMap(listeners, changes, start, Date.now())

        console.info(`[*]`, `${changes.length} changes / ${listeners.length} listeners`)
        if (listeners.length)
            console.log(listeners.map(listener => `${listener.displayName||listener.name}/${listener.renderCount}`).join("\n"))


		return changes
	}

    emit(type, path, operator, force) {
        this.push({ type, path, operator, forceChildPathUpdates: force })

		return this.commit()
	}
}

export default Changes
