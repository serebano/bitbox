import bitbox, { observable, observe } from "../bitbox"
import { print } from "../operators"

function Counter(box, observer) {
    return {
        count: box.count,
        inc() {
            return this.count++
        },
        dec() {
            return this.count--
        },
        run(max = 10, int = 100) {
            this.count = 0
            this.observer = observe(() => {
                observer(`conter(${this.count}/${max}) ${int}`)
                setTimeout(() => (this.count > max ? this.observer.off() : this.inc()), int)
            })
            return this
        }
    }
}

export const counter = bitbox(Counter, print)

export const counterbox = counter(observable({ count: 0 })).run(3)
