export default path => {
    return function toggle(context) {
        path(context, num => !num);
    };
};
