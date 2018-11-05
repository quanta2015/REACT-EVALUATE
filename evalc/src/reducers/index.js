const initialState = { 
    fetched: false, 
    user:{}
};

export function GET_LOGIN(data) {
    return { type: 'to_login_in', data}
}
export function DO_LOGOUT() {
    return { type: 'to_login_out'}
}
export function GET_LOGIN_ERROR(error) {
    return { type: 'get_login_error', error }
}
export function GET_CLASS(data) {
    return { type: 'get_class', data}
}
export function SAVE_TASK(data) {
    return { type: 'save_task', data}
}
export function SAVE_TASK_ERROR(error) {
    return { type: 'save_task_error', error}
}
export function GET_TASK(data) {
    return { type: 'get_task', data}
}
export function GET_TASK_ERROR(data) {
    return { type: 'get_task_error', data}
}
export function GET_DOTASK(data) {
    return { type: 'get_dotask', data}
}
export function GET_DOTASK_ERROR(data) {
    return { type: 'get_dotask_error', data}
}
export function SAVE_TASK_DETAIL(data) {
    return { type: 'save_task_detail', data}
}
export function GET_EVALTASK(data) {
    return { type: 'get_evaltask', data}
}
export function GET_EVALTASK_ERROR(data) {
    return { type: 'get_evaltask_error', data}
}
export function GET_EVALTASK_DETAIL(data) {
    return { type: 'get_evaltask_detail', data}
}
export function GET_EVALTASK_DETAIL_ERROR(data) {
    return { type: 'get_evaltask_detail_error', data}
}
export function SAVE_EVAL_DETAIL(data) {
    return { type: 'save_evaltask_detail', data}
}
export function SAVE_EVAL_DETAIL_ERROR(data) {
    return { type: 'save_evaltask_detail_error', data}
}
export function GET_RESULT(data) {
    return { type: 'get_result', data}
}
export function GET_RESULT_ERROR(data) {
    return { type: 'get_result_error', data}
}
export function GET_ANALYSIS_LIST(data) {
    return { type: 'get_analysis_list', data}
}
export function GET_ANALYSIS_LIST_ERROR(data) {
    return { type: 'get_analysis_list_error', data}
}
export function GET_ANALYSIS_DETAIL(data) {
    return { type: 'get_analysis_detail', data}
}
export function GET_ANALYSIS_DETAIL_ERROR(data) {
    return { type: 'get_analysis_detail_error', data}
}

const appReducer = (state = initialState, action) => {
    switch(action.type) {
        
        case 'to_login_in': {
            return {...state, fetched: true, user: action.data, isLogin: action.data.isLogin};
        }
        case 'to_login_out': {
            return {...state, fetched: true, isLogin: 0};
        }
        case 'get_class': {
            return {...state, fetched: true, class: action.data};
        }
        case 'save_task': {
            return {...state, fetched: true, ret: action.data};
        }
        case 'get_task': {
            return {...state, fetched: true, task: action.data};
        }
        case 'get_dotask': {
            return {...state, fetched: true, dotask: action.data};
        }
        case 'save_task_detail': {
            console.log('detail')
            return {...state, fetched: true, dotask: action.data};
        }
        case 'get_evaltask': {
            return {...state, fetched: true, evaltask: action.data};
        }
        case 'get_evaltask_detail': {
            return {...state, fetched: true, evaltaskdetail: action.data};
        }
        case 'save_evaltask_detail': {
            return {...state, fetched: true, evaltaskdetail: action.data};
        }
        case 'get_result': {
            return {...state, fetched: true, result: action.data, index: 1};
        }
        case 'get_analysis_list': {
            return {...state, fetched: true, analysisList: action.data};
        }
        case 'get_analysis_detail': {
            return {...state, fetched: true, analysisDetail: action.data};
        }

        
        default: return state;
    }
}

export default appReducer