function signal(chain) {
    const fn = props => signal.run("signal", chain, props);
    fn.displayName = `props => run(${chain}, props)`;
    fn.resolve = false;

    return fn;
}

export default signal;
