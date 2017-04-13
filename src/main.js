import bitbox from "./bitbox";
import get from "./handler/get";
import set from "./handler/set";
import has from "./handler/has";
import unset from "./handler/unset";
import resolve from "./handler/resolve";
import { observable, observe } from "./observer";

export default Object.assign(bitbox, { get, set, has, unset, resolve, observable, observe });
export { get, set, has, unset, resolve, observable, observe };

Object.assign(window, { get, set, has, unset, resolve, observable, observe, bitbox });
