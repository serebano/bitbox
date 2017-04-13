import bitbox, { observable } from "../main";

export const app = bitbox();

export const props = app.props();
export const state = app.state(observable);
export const signals = app.signals();
