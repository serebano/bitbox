import Path from '../model/path'
import apply from '../model/apply'
import extract from '../model/extract'
import Changes from '../model/changes'

function Model(target = {}, extend) {

    const changes = new Changes(target.changes)

    return Object.assign({
        path: 'root',
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
        remove(path) {
            return this.apply(path, function remove(target, key) {
                delete target[key]
            })
        },
        extract(path, view, ...args) {
            return extract(target, Path.resolve(this.path, path), view, ...args)
        },
        apply(path, trap, ...args) {
            const changed = apply(target, Path.resolve(this.path, path), trap, ...args)

            if (changed) {
                if (changed.method === "set" || changed.method === "remove")
                    changed.forceChildPathUpdates = true

                changes.push(changed)
                this.onChange && this.onChange(changed)
            }

            return changed
        }
    }, extend)
}

export default Model
