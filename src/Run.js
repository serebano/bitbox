import FunctionTree, { sequence, parallel } from "function-tree";

const providers = [
    function Context(context) {
        return Object.assign(context, run.context);
    }
];

const run = FunctionTree(providers);

run.context = {};
run.providers = providers;
run.sequence = sequence;
run.parallel = parallel;

export default run;
