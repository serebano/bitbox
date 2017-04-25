export function stringify(target) {
    return JSON.stringify(target, null, 4)
}

export function split(sep) {
    return target => target.split(sep)
}

export function toUpper(value) {
    return value.toUpperCase()
}

export function toLower(value) {
    return value.toLowerCase()
}

export function inc(number) {
    return number + 1
}

export function dec(number) {
    return number - 1
}

export function toggle(value) {
    return !value
}
