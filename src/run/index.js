import FunctionTree, { sequence, parallel } from "function-tree";

const run = FunctionTree([
    function Context(context) {
        return Object.assign(context, run.context);
    }
]);

run.context = {};

run.sequence = sequence;
run.parallel = parallel;

export default run;
