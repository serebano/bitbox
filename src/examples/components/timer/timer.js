import app, { state, props } from "../../app"

export default app(state.timers[props.id])
