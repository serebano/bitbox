/** @jsx h */

function Name({ name }, h) {
    return <h1 style={{ color: "red" }}>#{name}</h1>;
}

Name.connect = ({ state }) => ({
    name: [state`name`, name => name.toUpperCase()]
});

export default Name;
