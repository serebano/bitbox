import { observe } from "./observer";
/**

xxx = bit({ x: 1 })

bx = box(function myBox(props) {
    return {
        x: xxx.x,
        changed: this.changed,
        count: obj.state.count,
        items: Object.values(obj.state.timers).map(i => i.value)
    }
})

join = s => i => i.join(s)
map = f => p => p.map(f)

bp = bit(bit, resolve => function bxp(path, ...rest) {
    return resolve(path, bx, ...rest)
})

bp.paths(map(join("/")))


 */

export default observe;
