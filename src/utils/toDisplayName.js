import is from "../is"

export default (name, argNames = [], received = []) =>
    name +
    "(" +
    received
        //.filter(v => !is.placeholder(v))
        .map((val, idx) => {
            let argName = argNames[idx] || idx
            let argValue = val //is.func(val) ? val.displayName : String(val)
            // if (is.placeholder(val)) {
            //     argName = val.argName || argNames[idx]
            // }

            return `${argName}: ${argValue}`
        })
        .join(", ") +
    ")"
