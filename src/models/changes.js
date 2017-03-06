import Path from '../model/path'
import DepsStore from '../Changes'
import Changes from '../model/changes'

export default function ChangesModel(target = {}, store) {

	target.changes = new Changes(target.changes)

	const conn = new DepsStore()

	return {

		get size() {
			return target.changes.length
		},

		push(change) {
			return target.changes.push(change)
		},

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

			if (store.devtools)
				store.devtools.updateComponentsMap(listener, paths)

			return listener
		},

		off(paths, listener) {
			paths = Array.isArray(paths) ? paths : [paths]
			listener.paths = listener.paths.filter(path => paths.indexOf(path) === -1)

			conn.remove(listener, paths)

			if (store.devtools)
				store.devtools.updateComponentsMap(listener, null, paths)
		},

		update(newPaths, listener) {
			const oldPaths = listener.paths
			listener.paths = newPaths

			conn.update(listener, oldPaths, newPaths)

			if (store.devtools)
				store.devtools.updateComponentsMap(listener, newPaths, oldPaths)
		},

		commit(force) {
			if (!force && !target.changes.length)
				return []

			const start = Date.now()
			const changes = target.changes.flush()
			const listeners = force
				? conn.getAllListeners()
				: conn.getListeners(changes)

			listeners.forEach((listener) => {
				if (store.devtools)
					store.devtools.updateComponentsMap(listener)

				listener(changes)
			})

			if (store.devtools && listeners.length) {
				store.devtools.sendComponentsMap(listeners, changes, start, Date.now())
			}

			console.info(`[%c*%c]`, `color:red`, ``, `${changes.length} (changes) * ${listeners.length} (listeners)`)
			//console.info('[', changes.map(c => c.path.join(".")).join(", "), ']')
			if (listeners.length)
				console.log(listeners.map(listener => `${listener.displayName||listener.name}/${listener.renderCount} [ ${listener.paths.filter(path => changes.filter(cpath => cpath.path.join(".") === path).length).join(", ")} ]`).join("\n"))


			return changes
		}
	}
}
