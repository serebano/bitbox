import bitbox, { map } from "../bitbox"
import { print, assign, keys, push, pop } from "../operators"

const obj = {
    items: ["One"],
    users: {
        foo: {
            name: "Foo"
        }
    }
}

function mapping({ items, users, args }, { stringify, action, keys, print, push }) {
    return {
        userKeys: users(keys),
        str: stringify,
        size: items.length,
        mapped: {
            user: users.foo,
            print
        },
        addItem: action(items, push, args)
    }
}

const box = bitbox.create(mapping)

box(print)(obj)

export { box, obj }
