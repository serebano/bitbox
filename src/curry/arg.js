import create from "./create"
import is from "../is"
import * as operators from "../operators"
import { apply,get, has, defaultTo, pipe } from "../operators"
import resolve from "../resolve"
const pKey = "@@functional/placeholder"

function __(...args) {
    //const p = pipe(...args)
    const $ = pipe(...args) //(a) => p(a) //resolve(args) //(a) => p(a)

    $.args = args
  //  $.pipe = p
    //$.toString = () => `function ${args.map(arg => String(arg)).join(", ")}`
    $[pKey] = true

    return $
}
__[pKey] = true

export default __
