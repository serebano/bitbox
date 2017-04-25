import MapShim from "./Map"
import SetShim from "./Set"
import WeakMapShim from "./WeakMap"
import WeakSetShim from "./WeakSet"

export default new Map([
    [Map, MapShim],
    [Set, SetShim],
    [WeakMap, WeakMapShim],
    [WeakSet, WeakSetShim],
    [Date, true],
    [RegExp, true]
])
