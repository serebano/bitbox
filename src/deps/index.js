import DependencyStore from './DependencyStore'

export default function createDependencyStore() {

	const store = new DependencyStore()

	store.keys = {}
	store.changes = []

	store.get = function get(changes, force) {
		return force
			? store.getAllUniqueEntities()
			: store.getUniqueEntities(changes)
	}

	store.on = function on(/* ...paths, fn */) {
		const [ ...paths ] = arguments
		const component = paths.pop()

		if (component.map)
			component.remove()

		const map = paths.reduce((map, path) => {
			map[path] = true
			return map
		}, {})

		component.map = map
		component.remove = () => store.remove(component, map) && delete component.map
		store.addEntity(component, map)

		return component
	}

	store.register = (component, depsMap) => store.addEntity(component, depsMap)
	store.remove = (component, depsMap) => store.removeEntity(component, depsMap)
	store.update = (component, prevDepsMap, depsMap) => store.updateEntity(component, prevDepsMap, depsMap)

	store.commit = function commit(force) {
		const changes = store.changes
		const keys = store.keys
		store.changes = []
		store.keys = {}
		const components = store.get(changes, force)
		const updates = components.map((component) => {
			component._update ? component._update(changes) : component(changes)
			return { tag: component.tag, map: component.map }
		})

		return { keys, changes, components, updates, force }
	}

	store.emit = function emit(path) {
		store.push(path)
		return store.commit()
	}

	store.push = function push(path, forceChildPathUpdates = false) {

		if (store.keys[path])
			return store.keys[path]

		const size = store.changes.push({ path: path.split("."), forceChildPathUpdates })

		store.keys[path] = size - 1

		if (size > 10)
			console.warn(`(deps) ${size} uncommited changes`)

		return [ path, store.keys[path] ]
	}

	return store
}
