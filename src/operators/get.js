import bitbox from "../bitbox";

/**
 * get
 * @param  {Function|Array} box
 * @return {Any}
 */

export default function(box) {
    function get(target) {
        return bitbox.get(target, box);
    }

    get.displayName = `get(${box})`;

    return get;
}
