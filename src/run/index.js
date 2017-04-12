import FunctionTree, { sequence, parallel } from "function-tree";

export default providers => new FunctionTree(providers);

export { sequence, parallel };
