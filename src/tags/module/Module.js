import * as tags from '../'

class Module {
    constructor(context, path, desc) {

        this.path = path.join('.')
        this.name = path.slice().pop()

        const module = Object.assign({}, typeof desc === 'function'
            ? desc.call(this, {path:this.path,name:this.name}, tags)
            : desc)

        Object.assign(this, module)

        tags.state(this.path).set(context, module.state || {})

        this.signals = module.signals || {}
        this.modules = Object.keys(module.modules || {})
            .reduce((registered, key) => {
                registered[key] = new Module(context, path.concat(key), module.modules[key])
                return registered
            }, {})
    }
}

export default Module
