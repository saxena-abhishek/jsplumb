import {CALL_TRACE_FUNCTION} from '../src/actionables/actionTypes'

export const setUserName = payload => {
    return {
        type: "UPDATE_NAME",
        payload: payload
    }
}

export const callTraceFunction = payload => {
    // console.log(payload,"data in action")
    return {
        type: CALL_TRACE_FUNCTION,
        payload: payload
    }
}