import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import App from './components';
// import PostList from './components/PostList';
import Login from './components/Login/Login';
import TMainTch from './components/TMainTch/TMainTch'
import SMainStu from './components/SMainStu/SMainStu'
import store from './store'




const AppRouter = ({dispatch}) => (
    <BrowserRouter basename="/" >
        <App store={store}>
            <Route path="/"  exact component={Login}></Route>
            <Route exact path="/MainTch" component={TMainTch} ></Route>
            <Route exact path="/MainStu" component={SMainStu} ></Route>
        </App>
    </BrowserRouter>
    
);

export default AppRouter;