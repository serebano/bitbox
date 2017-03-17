export default target => {
    function pop(context) {
        context.select(target).apply(function pop(array) {
            array.pop();

            return array;
        });
    }
    pop.displayName = `pop(${target})`;
    return pop;
};
