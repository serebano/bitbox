import curry from "../curry"
import __ from "../placeholder"

import { get, set, add, observe, observable, tag, log } from "../operators"

export const inc = set("count", add(1, __(0)), __(observable))
export const dec = set("count", add(-1, __(0)), __(observable))
export const sub = observe(__, __(observable))

export const app = {}
export const countTag = __(tag`COUNT = ${"count"}`)

sub(log, app)
sub(log(countTag), app)
sub(curry(console.log, 1)(__(get("count"))), app)

inc(app)
