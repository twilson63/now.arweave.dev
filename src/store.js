import { writable } from 'svelte/store'

export const assets = writable([])
export const stampers = writable([])
export const profile = writable({})
export const collectors = writable([])
/*

import { createMachine, state, transition, invoke, reduce } from 'robot3'
import { useMachine } from 'svelte-robot-factory'


const assetMachine = createMachine({
  start: state(
    transition('upload', 'uploadDialog')
  ),
  uploadDialog: state(
    transition('uploaded', 'transactionDialog')
  ),
  transactionDialog: state(
    transition('dispatch', 'success')
  ),
  success: state()
})

export const service = useMachine(assetMachine)
*/