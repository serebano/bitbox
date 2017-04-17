import FunctionTree, { sequence, parallel } from "function-tree";
export { sequence, parallel, FunctionTree };

export default function create(...providers) {
    return new FunctionTree(providers);
}
