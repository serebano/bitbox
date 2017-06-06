import is from "../is"

export default (name, argNames = [], received = []) =>
    name +
    "(" +
    received
        //.filter(v => !is.placeholder(v))
        .map(
            (val, idx) =>
                `${argNames[idx]}: ` +
                (is.placeholder(val) ? "__" : is.func(val) && val.displayName ? val.displayName : `${val}`)
        )
        .join(", ") +
    ")"
