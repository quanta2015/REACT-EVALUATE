import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';
import appReducer from './reducers';
import rootSaga from './sagas';


const sagaMiddleware = createSagaMiddleware();
const store = createStore(appReducer, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), 
    applyMiddleware(...[sagaMiddleware]));
sagaMiddleware.run(rootSaga);



export default store