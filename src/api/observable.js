import bitbox from "../bitbox"
import run, { action } from "../run"
import observe from "../observe"
import observable from "../observable"

const box = bitbox()
const obj = observable({
    count: box.count,
    inc() {
        return this.count++
    }
})

box(box =>
    box({
        props: observable({
            count: box.count,
            inc() {
                this.count++
            }
        }),
        observer(fn) {
            return observe(fn, this, this)
        }
    })
)

const person = observable({
    // observable properties:
    name: "John",
    age: 42,
    showAge: false,

    // computed property:
    get labelText() {
        return this.showAge ? `${this.name} (age: ${this.age})` : this.name
    },

    // action:
    setAge: action(function() {
        this.age = 21
    })
})

observe(() => console.log(person.labelText))

person.name = "Dave"
person.setAge(21)
// etc
