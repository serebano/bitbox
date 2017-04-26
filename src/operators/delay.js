function delay(func, wait) {
    return function() {
        setTimeout(() => {
            func.apply(this, arguments)
        }, wait)
    }
}

export default delay
