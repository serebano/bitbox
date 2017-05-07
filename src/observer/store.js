export const queue = new Set()
export const proxies = new WeakMap()
export const observers = new WeakMap()
export const enumerate = Symbol("enumerate")
export const state = { queued: false, currentObserver: undefined }
