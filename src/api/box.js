import bitbox, { map, inc, concat, print } from "../bitbox"

export const map1 = ({ state }, { observable }) => {
    return {
        state: state(observable),
        foo: state(target => {
            return {
                bar: target.name,
                items: target.items || (target.items = [])
            }
        })(observable)
    }
}

export const map2 = ({ state, foo }) => {
    return {
        count: state.count,
        foo: foo.bar,
        items: foo.items,
        x: state.name
    }
}

export const map3 = map(map2, map1)

export const app = bitbox(map3)

export const obj = {
    state: {
        count: 0,
        items: []
    }
}

app.count(obj, app.count(inc))

bitbox(
    target => [
        app.items(concat(1, 2, 3))(target),
        app.items(concat, 1, 2, 3)(target),
        app.items(target).concat(1, 2, 3)
    ],
    print
)(obj)
