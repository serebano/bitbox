const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm
const DEFAULT_PARAMS = /=[^,]+/gm
const FAT_ARROWS = /=>.*$/gm

function getArgNames(fn) {
    const code = fn.toString().replace(COMMENTS, "").replace(FAT_ARROWS, "").replace(DEFAULT_PARAMS, "")
    const result = code.slice(code.indexOf("(") + 1, code.indexOf(")")).match(/([^\s,]+)/g)

    return result === null ? [] : result
}

export default getArgNames
