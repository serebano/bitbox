import is from "../utils/is";

export default path => {
    function get(target, key) {
        return Reflect.get(target, key);
    }

    return is.path(path) ? path(get) : get;
};
