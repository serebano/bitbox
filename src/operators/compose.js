function compose(...fns) {
    return fns.reduce((f, g) => {
        return function composed(...args) {
            return f(g(...args))
        }
    })
}

export default compose
