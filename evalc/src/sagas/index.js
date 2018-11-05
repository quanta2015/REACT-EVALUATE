import { take,all,fork,call,select, put } from 'redux-saga/effects';
import axios from 'axios';
import { GET_LOGIN, DO_LOGOUT, GET_LOGIN_ERROR, GET_CLASS, SAVE_TASK_ERROR, GET_TASK, GET_TASK_ERROR, GET_DOTASK, GET_DOTASK_ERROR, SAVE_TASK_DETAIL, GET_EVALTASK, GET_EVALTASK_ERROR, GET_EVALTASK_DETAIL, GET_EVALTASK_DETAIL_ERROR, SAVE_EVAL_DETAIL, SAVE_EVAL_DETAIL_ERROR, GET_RESULT, GET_RESULT_ERROR,GET_ANALYSIS_LIST,GET_ANALYSIS_LIST_ERROR,GET_ANALYSIS_DETAIL,GET_ANALYSIS_DETAIL_ERROR } from '../reducers';
import { message } from 'antd';

var host = 'http://localhost:4000/';


function * watchIsLogout(){
    while(true){
        yield take('TO_LOGIN_OUT');
        yield put(DO_LOGOUT());
    }
}

function * watchIsLogin(){
    while(true){
        const act=yield take('TO_LOGIN_IN');
        try {
            const res=yield call(axios.post, host + 'login',{ usr:act.usr, pwd:act.pwd});
            (res.data.code==='0')?res.data.isLogin = 1:res.data.isLogin = 2;
            
            yield put(GET_LOGIN(res.data));
        } catch(e) {
            yield put(GET_LOGIN_ERROR(e));
        }
    }
}

function * watchSaveTask(){
    while(true){
        const act=yield take('TO_SAVE_TASK');
        try {
            // console.log(act.data)
            const res=yield call(axios.post, host + 'sys/saveTask',{ uid:act.data.uid, cls:act.data.cls, from:act.data.from,to:act.data.to,tl:act.data.tl,cnt:act.data.cnt});
            console.log(res.data);

            if ( parseInt(res.data.code,0) === 0 ) {
                message.success(res.data.msg);
            }
            // yield put(SAVE_TASK(res.data));
        } catch(e) {
            yield put(SAVE_TASK_ERROR(e));
        }
    }
}

function * watchGetClass(){
    while(true){
        yield take('GET_CLASS');
        try {
            const res=yield call(axios.get, host + 'sys/getClass');

            yield put(GET_CLASS(res.data.data));
        } catch(e) {
            yield put(GET_LOGIN_ERROR(e));
        }
    }
}

function * watchGetTask(){
    while(true){
        yield take('TO_GET_TASK');
        try {
            const res=yield call(axios.get, host + 'sys/getTask');
            yield put(GET_TASK(res.data.data));
        } catch(e) {
            yield put(GET_TASK_ERROR(e));
        }
    }
}

function * watchGetDoTask(){
    while(true){
        const act = yield take('TO_GET_DOTASK');
        try {
            // console.log(act.data)
            const res=yield call(axios.post, host + 'sys/getDoTask', act.data);
            yield put(GET_DOTASK(res.data.data));
        } catch(e) {
            yield put(GET_DOTASK_ERROR(e));
        }
    }
}

function * watchSaveTaskDetail(){
    while(true){
        const act=yield take('SAVE_DOTASK_DETAIL');
        try {
            const uid = act.data.uid;
            const tid = act.data.tid;
            const pid = act.data.pid;
            const dtid = act.data.dtid;
            const res=yield call(axios.post, 
                host + 'sys/saveTaskDetail',
                { uid:uid, tid:tid, pid: pid, dtid: dtid });

            if ( parseInt(res.data.code,0) === 0 ) {
                message.success(res.data.msg);

                var tmp = yield select(state => state.dotask);
                var list = JSON.parse(JSON.stringify(tmp));
                for(var i=0;i<list.length;i++) {
                    if (parseInt(list[i].task_id,0) === parseInt(tid,0)) {
                        list[i].complete = 1;
                    }
                }
            }
            yield put(SAVE_TASK_DETAIL(list));
        } catch(e) {
            yield put(SAVE_TASK_ERROR(e));
        }
    }
}


function * watchGetEvalTask(){
    while(true){
        const act = yield take('TO_GET_EVALTASK');
        try {
            console.log(act.data)
            const res=yield call(axios.post, host + 'sys/getEvalTask', act.data);
            yield put(GET_EVALTASK(res.data.data));
        } catch(e) {
            yield put(GET_EVALTASK_ERROR(e));
        }
    }
}

function * watchGetEvalTaskDetail(){
    while(true){
        const act = yield take('TO_GET_EVALTASK_DETAIL');
        try {
            // console.log(act.data)
            const res=yield call(axios.post, host + 'sys/getEvalTaskDetail', act.data);
            yield put(GET_EVALTASK_DETAIL(res.data.data));
        } catch(e) {
            yield put(GET_EVALTASK_DETAIL_ERROR(e));
        }
    }
}

function * watchSaveEvalDetail(){
    while(true){
        const act = yield take('TO_SAVE_EVALDETAIL');
        try {
            // console.log(act.data)
            const res=yield call(axios.post, host + 'sys/saveEvalTaskDetail', act.data);

            if ( parseInt(res.data.code,0) === 0 ) {
                yield put(SAVE_EVAL_DETAIL(res.data.data));
                message.success(res.data.msg);
            }
        } catch(e) {
            yield put(SAVE_EVAL_DETAIL_ERROR(e));
        }
    }
}

function * watchGetResult(){
    while(true){
        const act = yield take('TO_GET_RESULT');
        try {
            const res=yield call(axios.post, host + 'sys/getResult', act.data);

            if ( parseInt(res.data.code,0) === 0 ) {
                yield put(GET_RESULT(res.data.data));
                message.success(res.data.msg);
            }
        } catch(e) {
            yield put(GET_RESULT_ERROR(e));
        }
    }
}

function * watchGetAnalysisList(){
    while(true){
        const act = yield take('TO_GET_ANALYSIS_LIST');
        try {
            const res=yield call(axios.post, host + 'sys/getAnalysisList', act.data);

            if ( parseInt(res.data.code,0) === 0 ) {
                yield put(GET_ANALYSIS_LIST(res.data.data));
                message.success(res.data.msg);
            }
        } catch(e) {
            yield put(GET_ANALYSIS_LIST_ERROR(e));
        }
    }
}

function * watchGetAnalysisDetail(){
    while(true){
        const act = yield take('TO_GET_ANALYSIS_DETAIL');
        try {
            const res=yield call(axios.post, host + 'sys/getAnalysisDetail', act.data);

            if ( parseInt(res.data.code,0) === 0 ) {
                yield put(GET_ANALYSIS_DETAIL(res.data.data));
                message.success(res.data.msg);
            }
        } catch(e) {
            yield put(GET_ANALYSIS_DETAIL_ERROR(e));
        }
    }
}



export default function* rootSaga() {
    yield all([
        fork(watchIsLogin),
        fork(watchIsLogout),
        fork(watchGetClass),
        fork(watchSaveTask),
        fork(watchGetTask),
        fork(watchGetDoTask),
        fork(watchSaveTaskDetail),
        fork(watchGetEvalTask),
        fork(watchGetEvalTaskDetail),
        fork(watchSaveEvalDetail),
        fork(watchGetResult),
        fork(watchGetAnalysisList),
        fork(watchGetAnalysisDetail),
    ])
} 