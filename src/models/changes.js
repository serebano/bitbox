import Model from '../model/create'
import Path from '../model/path'
import Changes from '../Changes'

export default (target, store) => {

	target.changes = []

	const { devtools } = store
	const conn = new Changes()

	return new Model(target,
		{
			get(target, key) {
				return key
					? target.changes[key]
					: target.changes
			},
			push(target, value) {
				return target.changes.push(value)
			}
		},
		function Changes(target, handler) {

			function debug(e, index) {
				const type = e.path.slice().shift()
		        const args = ["%c'"+(e.path.slice(1).join(".")||".")+"'%c"].concat(e.args).map(arg => {
		            if (typeof arg === "function") return (arg.displayName || arg.name) || String(arg)
		            if (typeof arg === "object") return JSON.stringify(arg)
		            return String(arg)
		        }).join(", ")
		        if (e.action)
		            console.log(`[${index}] ${e.action.name}`, e.action)
		        console.log(`[${index}] %c${type}%c.%c${e.method}%c(${args}%c)`, `color:#e5c07b`, `color:#abb2bf`, `color:#61afef`, `color:#abb2bf`, `color:#98c379`, `color:#5c6370`, 'color:#abb2bf')

		    }

			return {
				keys: {},
				get(path, operator) {
			        const keys = Path.keys(path)
			        const length = keys.length

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

			        }, target.changes)
			    },
				on(paths, listener) {
					paths = Array.isArray(paths) ? paths : [paths]
					listener.paths = (listener.paths||[]).concat(paths)

					listener.add = (paths) => this.update(listener.paths.concat(paths), listener)
					listener.remove = (paths) => this.off(paths, listener)
					listener.update = (paths) => this.update(paths, listener)

					conn.add(listener, paths)
					if (conn.listeners.indexOf(listener) === -1)
						conn.listeners.push(listener)

					if (devtools)
						devtools.updateComponentsMap(listener, paths)

					return listener
				},
				off(paths, listener) {
					paths = Array.isArray(paths) ? paths : [paths]
					listener.paths = listener.paths.filter(path => paths.indexOf(path) === -1)

					conn.remove(listener, paths)
					if (!listener.paths.length)
						conn.listeners.splice(conn.listeners.indexOf(listener), 1)

					if (devtools)
						devtools.updateComponentsMap(listener, null, paths)
				},
				update(newPaths, listener) {
		            const oldPaths = listener.paths
		            listener.paths = newPaths

		            conn.update(listener, oldPaths, newPaths)
					if (!listener.paths.length)
						conn.listeners.splice(conn.listeners.indexOf(listener), 1)

		            if (devtools)
		                devtools.updateComponentsMap(listener, newPaths, oldPaths)
		        },
				push(change) {

					const key = [change.method].concat(change.keys).join(".")

					if (key in this.keys)
						return this.keys[key]

					this.keys[key] = handler.push(target, {
						path: change.keys,
						method: change.method,
						forceChildPathUpdates: false
					})

					debug(change, this.size)

					return change
				},
				commit(force) {
					if (!force && !target.changes.length)
			            return []

			        const start = Date.now()
					const changes = target.changes
					const listeners = force
			            ? conn.getAllListeners()
			            : conn.getListeners(changes)

					listeners.forEach((listener) => {
			            if (devtools)
			                devtools.updateComponentsMap(listener)

			            listener(changes)
					})

			        target.changes = []
			    	this.keys = {}

			        if (devtools && listeners.length)
			            devtools.sendComponentsMap(listeners, changes, start, Date.now())

			        console.info(`[*]`, `${changes.length} changes / ${listeners.length} listeners`)
			        //console.info('[', changes.map(c => c.path.join(".")).join(", "), ']')
			        if (listeners.length)
			            console.log(listeners.map(listener => `${listener.displayName||listener.name}/${listener.renderCount} [ ${listener.paths.join(", ")} ]`).join("\n"))


					return changes
				},
				get size() {
					return target.changes.length
				},
				get listeners() {
					return conn.listeners
				}
			}
		}
	)
}
