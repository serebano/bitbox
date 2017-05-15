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

export function Name(box) {
    return `box(${String(box)})`
}

export const box = bitbox()
export const demo = box.demo(observable)

export function Log(box) {
    this.name = `Log(${box})`
    return Object.assign(this, box)
}

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

export function oCount(box, fn) {
    const obj = observable({
        path: [...box].join("."),
        count: box,
        inc() {
            return this.count++
        },
        dec() {
            return this.count--
        }
    })
    return fn ? fn(obj) : obj
}
export const ocount = new box(oCount)

export const fooO = resolve(obj.counters, new box.foo(oCount))
export const barO = resolve(obj.counters, new box.bar(oCount))
export const bazO = resolve(obj.counters, new box.baz(oCount))

export const xxxO = bitbox("counters", function xxx(box) {
    return {
        foo: oCount(box.foo),
        bar: oCount(box.bar),
        baz: oCount(box.baz)
    }
})

export class Count {
    constructor(box, obj) {
        console.info(`Count - box, obj`, { box, obj })

        this.name = `Count(${box})`
        this.value = resolve(obj, box) //(obj)
    }
    init(target, proxy) {
        observe(() => print({ target, proxy }))
    }
    inc() {
        return this.value++
    }
    dec() {
        return this.value--
    }
    run(max = 10, int = 100) {
        clearInterval(this.id)
        this.id = setInterval(() => {
            this.value < max ? this.inc() : clearInterval(this.id)
        }, int)
    }
}

export const ticker = observable({
    tick: 1,
    increment() {
        return this.tick++
    },
    start() {
        this.id = setInterval(() => this.increment(), 1)
    }
})

export class Counters {
    constructor(box, obj) {
        console.log(`Counters - box, obj`, { box, obj })

        this.name = `Counters(${box})`
        this.path = box.toArray()
        this.items = new box(function Items(box, obj) {
            console.log(`ITEMS - box, obj`, { box, obj, res: box(obj) })
            this.foo = new box.foo(Count, box(obj))
            this.bar = new box.bar(Count, box(obj))
            this.baz = new box.baz(Count, box(obj))
        }, box(obj))
        //return bitbox(...box, this)(obj)
        //this.r = resolve(obj, this)
        //
        //return this
    }
    init(target, proxy) {
        return target
    }
    get(key) {
        return key ? this.items[key] : this.items
    }
    values() {
        return Object.keys(this.items).map(key => this.items[key].value)
    }
    get size() {
        return Object.keys(this.items).length
    }
}

export const counters = new box.counters(Counters, obj)

export const app = bitbox({
    items: [],
    ticker,
    counters2: box.b2(counters),
    counters: new box.cxx(Counters, { cxx: obj }),
    get itemsString() {
        return this.items.map(i => i.name + " = " + i.value)
    },
    deep: { fooO, barO, bazO },
    keys: box(Object.keys),
    print() {
        print(this)
    }
})(obj)
