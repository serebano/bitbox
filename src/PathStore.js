import DepsStore from './deps'

class PathStore extends DepsStore {
    on(...paths) {
        const listener = paths.pop()

        return this.add(listener, ...paths)
    }

    off(...paths) {
        const listener = paths.pop()

        return this.remove(listener, ...paths)
    }
}

export default PathStore
