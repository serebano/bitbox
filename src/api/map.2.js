function Counter(box, observer) {
    return {
        count: box.count,
        inc() {
            return this.count++
        },
        dec() {
            return this.count--
        },
        run(int) {
            this.count = 0
            const o = observe(() => {
                observer(`conter() -> ${this.count}`)
                setTimeout(() => (this.count > 10 ? o.off() : this.inc()), int || 100)
            })

            return o
        }
    }
}

counter = bitbox(Counter, print)
counter(observable()).run()
