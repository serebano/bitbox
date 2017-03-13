import Resolve from '../Resolve'

export default function(store) {
    return function StoreProvider(context) {
        context.get = (target) => target.get(context)
        context.model = (target) => target.model(context)
        context.resolve = Resolve(context)

        return context
    }
}
