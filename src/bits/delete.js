export function $delete(target, key) {
    return Reflect.deleteProperty(target, key);
}

export default (path, object) => path($delete, object);
