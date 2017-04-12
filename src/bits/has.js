import is from "../utils/is";

export default path => {
    function has(target, key) {
        return Reflect.has(target, key);
    }

    return is.path(path) ? path(has) : has;
};
