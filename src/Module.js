import {state} from '../../tags'

class Module {
    constructor(store, path, moduleDescription) {
        const moduleStub = {
            //store,
            path: path.join('.'),
            name: path.slice().pop()
        }

        const module = typeof moduleDescription === 'function'
            ? moduleDescription.call(this, store.tags)
            : moduleDescription

		//const {state} = store.tags

        store.set(state`${path.join('.')}`, module.state || {})

        module.signals = Object.keys(module.signals || {})
            .reduce((currentSignals, signalKey) => {
                const signal = module.signals[signalKey]
                currentSignals[signalKey] = (props) => store.runSignal(signalKey, signal, props)
                return currentSignals
            }, {})

        /* Instantiate submodules */
        module.modules = Object.keys(module.modules || {}).reduce((registered, moduleKey) => {
            registered[moduleKey] = new Module(store, path.concat(moduleKey), module.modules[moduleKey])
            return registered
        }, {})

        return module
    }
}

export default Module
