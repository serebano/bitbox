import is from "../is"

export default (name, argNames = [], received = []) =>
    name +
    "(" +
    received
        //.filter(v => !is.placeholder(v))
        .map((val, idx) => {
            let argName = idx
            if (is.placeholder(val)) {
                argName = val.key || argNames[idx]
            }
            let argValue = is.func(val) ? val.displayName || val.name : val

            return `${argName}: ${argValue}`
        })
        .join(", ") +
    ")"
