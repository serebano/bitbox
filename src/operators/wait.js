function waitFactory(value, next) {
    function wait({ path, resolve }) {
        const ms = resolve.value(value)

        return new Promise((resolve) => {
            setTimeout(() => resolve(path ? path.then() : next), ms)
        })
    }

    wait.displayName = `wait(${value})`

    return wait
}

export default waitFactory
