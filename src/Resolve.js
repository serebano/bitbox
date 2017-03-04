import Tag from './Tag'

function Resolve(context) {
    const $ = (props) => props
        ? Object.assign({}, context, { props })
        : !context.props
            ? Object.assign({ props: {} }, context)
            : context

    return {
        type(target) {
            if (!(target instanceof Tag))
                throw new Error(`Invalid target: ${target}`)

            return target.type
        },
        path(target, props) {
            return target.path($(props))
        },
        paths(target, types, props) {
            if (Array.isArray(target))
                return target

            if (!(target instanceof Tag))
                throw new Error(`Invalid target: ${target}`)

            return target.paths($(props), types)
        },
        value(target, props) {
            return target instanceof Tag
                ? target.get($(props))
                : target
        },
        model(target) {
            if (!(target instanceof Tag))
                throw new Error(`Invalid target: ${target}`)

            return target.model(context)
        }
    }
}

export default Resolve
