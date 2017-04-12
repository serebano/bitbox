function $delete(target, key, obj) {
    if (typeof target === "function") return target($delete, ...[...arguments].slice(1));

    const result = Reflect.deleteProperty(target, key);
    return Reflect.has(obj, "execution") ? undefined : result;
}

export default $delete;
