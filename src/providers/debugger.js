export default (send, options = {colors: {}}) => (context, functionDetails, payload) => {
    context.debugger = {
        send(data) {
            send(data, context, functionDetails, payload)
        },
        getColor(key) {
            return options.colors[key] || '#333'
        }
    }

    send(null, context, functionDetails, payload)

    return context
}
