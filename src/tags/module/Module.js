import * as tags from '../'

class Module {
    constructor(store, path, desc) {

        this.path = path.join('.')
        this.name = path.slice().pop()

        const module = Object.assign({}, typeof desc === 'function'
            ? desc.call(this, { path: this.path, name: this.name }, tags)
            : desc)

        Object.assign(this, module)

        store.state.set(this.path, module.state || {})
        store.signal.set(this.path, {})

        this.signals = module.signals || {}

        Object.keys(this.signals).forEach(name => {
            const chain = module.signals[name]
            const signal = (props) => store.run(this.path, chain, props)
            const path = this.path ? `${this.path}.${name}` : name
            signal.displayName = path
            signal.toString = () => `function ${path}(props) { [Actions] }`

            store.signal.set(path, signal)
        })

        this.modules = Object.keys(module.modules || {})
            .reduce((registered, key) => {
                registered[key] = new Module(store, path.concat(key), module.modules[key])
                return registered
            }, {})
    }
}

export default Module
