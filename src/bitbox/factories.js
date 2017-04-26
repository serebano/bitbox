import bitbox from "."
import * as observer from "./observer"
export { default as compute } from "./compute"

/**
 * handler factories
 */

export function get(box) {
    return target => bitbox.get(target, box)
}

export function set(box, value) {
    return target => bitbox.set(target, box, value) && undefined
}

export function map(mapping, context) {
    return target => bitbox.map(target, mapping, context)
}

export function has(box) {
    return target => bitbox.has(target, box)
}

export function keys(box) {
    return target => bitbox.keys(target, box)
}

export function unset(box) {
    return target => bitbox.delete(target, box)
}

export function define(box, descriptor) {
    return target => bitbox.define(target, box, descriptor)
}

export function apply(box, args) {
    return target => bitbox.apply(target, box, args)
}

export function observe(box, args) {
    return target => bitbox.observe(target, box, args)
}

export function proxy(handler) {
    return target => new Proxy(target, handler)
}

export function observable(target) {
    return observer.observable(target)
}
