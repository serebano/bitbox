import Tag from './Tag'

function Resolve(context) {
    const $ = (props) => props
        ? Object.assign({}, context, { props })
        : !context.props
            ? Object.assign({ props: {} }, context)
            : context

    return {
        isTag(arg, ...types) {
            if (!(arg instanceof Tag)) {
                return false
            }

            if (types.length) {
                return types.reduce((isType, type) => {
                    return isType || type === arg.type
                }, false)
            }

            return true
        },
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
        model(target, extend) {
            if (!(target instanceof Tag))
                throw new Error(`Invalid target: ${target}`)

            return target.model(context, extend)
        }
    }
}

export default Resolve
