/** @jsx h */
import { state, props } from "../../api";
import { or, eq, ensure, is, concat } from "../../bits";

function Github(props, h) {
    return (
        <section>
            <h2>Github {props.users.join(", ")}</h2>
            <div>
                {props.repos.map((repo, key) => {
                    return (
                        <div key={key}>
                            <pre>{JSON.stringify({ id: repo.$raw.id, name: repo.$raw.name })}</pre>
                        </div>
                    );
                })}
            </div>
            <pre>{JSON.stringify(props.$observer, null, 4)}</pre>
        </section>
    );
}

Github.map = {
    users: state.repos[props.user](Object.keys),
    repos: state.repos[props.user](Object.values)
};

export default Github;
