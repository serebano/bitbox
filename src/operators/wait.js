function waitFactory(ms, next) {
    function wait(context) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(next), ms)
        })
    }

    wait.displayName = 'wait - ' + ms + 'ms'

    return wait
}

export default waitFactory
