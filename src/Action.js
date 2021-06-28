import {CALL_TRACE_FUNCTION,SEND_LAUNCH_STATUS, CALL_DOWNLOAD_FUNCTION,SEND_DOWNLOAD_STATUS} from '../src/actionables/actionTypes'

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

export const callDownloadFunction = payload => {
    return {
        type: CALL_DOWNLOAD_FUNCTION,
        payload: payload
    }
}


export const sendLaunchStatus = payload => {
    // console.log(payload,"data in action")
    return {
        type: SEND_LAUNCH_STATUS,
        payload: payload
    }
}
export const sendDownloadStatus = payload => {
    // console.log(payload,"data in action")
    return {
        type: SEND_DOWNLOAD_STATUS,
        payload: payload
    }
}