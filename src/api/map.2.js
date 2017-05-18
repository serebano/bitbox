import bitbox, { observable, observe, map, resolve, construct, create } from "../bitbox"
import { print } from "../operators"
import { is } from "../utils"

export const obj = observable({
    count: 0,
    name: "map box",
    counters: {
        foo: 1,
        bar: 2,
        baz: 3
    },
    demo: {}
})

export const ticker = observable({
    value: 1,
    increment() {
        this.value++
    },
    toggle() {
        this.id = this.id ? clearInterval(this.id) : setInterval(() => this.increment(), 1)

        return this
    }
})

observe(() => document.body.innerHTML = ticker.value)

ticker.toggle()

export class One {
    constructor(box) {
        this.path = [...box]
        this.title = `one(${box})`
        this.color = "grey"
        this.count = 0
        this.observing = []
    }
    run(ms) {
        this.ms = ms || 100
        this.count = 0
        clearInterval(this.id)
        this.id = setInterval(() => this.inc(), this.ms)

        return !this.observing.length && this.observe()
    }
    inc() {
        return this.count++
    }
    dec() {
        return this.count--
    }
    get state() {
        return this.id ? "running" : "stopped"
    }
    observe() {
        const observer = observe(() => {
            document.body.innerHTML = `
            <div style="color:${this.color}">
                <h1>${this.title} = ${this.count}</h1>
                <hr />
                ${this.state} | ${this.id} - ${this.ms}
                <pre>${JSON.stringify(observer ? { paths: observer.paths.map(p =>
                              p.join(".")
                          ), changes: observer.changes.map(p => p.join(".")) } : {}, null, 2)}</pre>
            </div>`
        })
        print((this.observing = observer.paths))
        return observer
    }
}

obj.dev = { deep: { one: { count: 0 }, xxx: {} } }

// export const one = bitbox(new One(box.dev.deep.one))
// one.observe()
// one.run(1)

export function oCount(box) {
    return {
        value: box.count,
        inc() {
            return this.value++
        },
        dec() {
            return this.value--
        }
    }
}

function run(max = 10, int = 100) {
    this.value = 0
    clearInterval(this.id)
    this.id = setInterval(() => {
        this.value < max ? this.inc() : clearInterval(this.id)
    }, int)
}

export function B1(box) {
    return box.xxx(observable, function B1(obj) {
        return Object.assign(obj, {
            value: 0,
            inc() {
                return this.value++
            },
            dec() {
                return this.value--
            },
            run
        })
    })
}
export function B2(box) {
    return box(observable, {
        value: 0,
        inc() {
            return this.value++
        },
        dec() {
            return this.value--
        },
        run
    })
}

export const xxx = bitbox(B1)

export const xxxbox = xxx({ value: 1 })

observe(() => console.log(`b1`, xxxbox.value))

xxxbox.run()

export const b2 = bitbox(B2)
export const b2box = b2({ value: 1 })

observe(() => console.log(`b2`, b2box.value))

b2box.run()

//({ count: 1 })

export class Count {
    constructor(value = 0) {
        this.value = value
        observe(() => console.log(`counter: ${this}`, this.value))
        this.run()
    }
    inc() {
        return this.value++
    }
    dec() {
        return this.value--
    }
    run(max = 10, int = 100) {
        this.value = 0
        clearInterval(this.id)
        this.id = setInterval(() => {
            this.value < max ? this.inc() : clearInterval(this.id)
        }, int)
    }
}

export const count = new Count(0)
// export const count2 = new Count(3)

export const app = bitbox({
    items: [],
    ticker,
    get itemsString() {
        return this.items.map(i => i.name + " = " + i.value)
    },
    print() {
        print(this)
    }
})(obj)
