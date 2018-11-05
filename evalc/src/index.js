import './asset/less/style.css';
import 'antd/dist/antd.min.css';
// import $ from 'jquery';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';


import AppRouter from './router';
import store from './store'



render(
    <Provider store={store}>
        <AppRouter/>
    </Provider>,
    document.querySelector('#root')
);



// $(window).on('beforeunload', function (event) {
    
//     // const userInfoState = localStorage.getItem('userInfoState');
    
//     // var s = JSON.parse(userInfoState);
//     console.log('leave');

//     console.log($(window).location)
//     // console.log(userInfoState);
//     // store.isLogin = s.isLogin;
//     // store.user = s.user;

//     return "离开页面将丢失信息！";
//   });