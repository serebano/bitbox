import Path from '../model/path'
import apply from '../model/apply'
import extract from '../model/extract'

function Model(target) {
    return {
		root: [],
		changes: [],
        get(path, view) {
            return this.extract(path, function get(target, key) {
                return view
                    ? view(target[key])
                    : target[key]
            }, view)
        },
        set(path, value) {
            return this.apply(path, function set(target, key, value) {
                target[key] = value

                return true
            }, value)
        },
        has(path) {
            return this.extract(path, function has(target, key) {
                return (key in target)
            })
        },
        extract(path, view, ...args) {
            return extract(target, Path.resolve(this.root, path), view, ...args)
        },
        apply(path, trap, ...args) {
            const changed = apply(target, Path.resolve(this.root, path), trap, ...args)

            if (changed)
                this.changes.push(changed)

            return changed
        }
    }
}

export default Model
