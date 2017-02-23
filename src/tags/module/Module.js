import * as tags from '../'

class Module {
    constructor(store, path, desc) {

        this.path = path.join('.')
        this.name = path.slice().pop()

        const module = Object.assign({}, typeof desc === 'function'
            ? desc.call(this, tags, store)
            : desc)

        this.state = module.state || {}

        store.set(tags.state`${this.path||'.'}`, this.state)

        this.signals = Object.keys(module.signals || {})
            .reduce((signals, key) => {
                const chain = module.signals[key]
                signals[key] = (props) => store.run(chain, props) && store.deps.commit()

                return signals
            }, {})

        this.modules = Object.keys(module.modules || {})
            .reduce((registered, key) => {
                registered[key] = new Module(store, path.concat(key), module.modules[key])
                return registered
            }, {})
    }
}

export default Module
