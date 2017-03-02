function update(target, ...args) {

    const operator = args[args.length-1]

    function action(context) {
        return context.update(target, ...args)
    }

    action.displayName = `${operator.name}(${target}, ${args.map(String).join(", ")})`

    return action
}

export default update
