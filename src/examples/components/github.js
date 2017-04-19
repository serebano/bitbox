/** @jsx h */
import { state, props } from "../app"
import { or, eq, join, ensure, is, concat } from "../../operators"

function Github(props, h) {
    return (
        <section>
            <h2>Github {props.users}</h2>
            <div>
                {props.repos.map((repo, key) => {
                    return (
                        <div key={key}>
                            <pre>{JSON.stringify({ id: repo.$raw.id, name: repo.$raw.name })}</pre>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

Github.map = {
    users: state.repos[props.user](Object.keys, join(` * `)),
    repos: state.repos[props.user](Object.values)
}

export default Github
