import handler from '../model/handler'

export default (target, ...args) => {
    return (context) => {
        target.apply(context, handler.push, ...args)
    }
}
