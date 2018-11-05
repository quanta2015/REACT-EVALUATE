import React, { Component }  from 'react'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import './Login.css'
import {toastIt} from '../Toastr/toastr';
import store from '../../store';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { user: null, isLogin:-1 }
  }

  componentWillUnmount =()=>{

    const {user, isLogin}  = store.getState();
    const userInfoState = localStorage.getItem('userInfoState');

    if (userInfoState) {
      localStorage.removeItem('userInfoState');
    }

    var  data = JSON.stringify({ user:user, isLogin: isLogin })
    localStorage.setItem('userInfoState', data);
  }


  render() {  
    const {toLoginIn, isLogin, user}=this.props;
    if (isLogin === 1) {
      switch( user.data.role ) {
        case 0:return <Redirect to='/MainTch'></Redirect>;
        case 1:return <Redirect to='/MainStu'></Redirect>;
        default:return <Redirect to='/MainTch'></Redirect>;
      }
    }else if (isLogin === 2) {
      toastIt(user.msg)
    }
    return (
      <div className="g-login">
        <div className="row">
          <input type="text" placeholder="input user name ..." id='usr'/>
        </div>
        <div className="row">
          <input type="password" placeholder="input password ..." id='pwd' />
        </div>
        <div className="row">
          <button onClick={toLoginIn.bind(this)}>登录</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps  = (state) => ({
  user: state.user,
  isLogin: state.isLogin
});

const mapStateToDispatch=(dispatch)=>{
  return {
    toLoginIn:(e)=>{
      var usr = document.getElementById('usr').value;
      var pwd = document.getElementById('pwd').value;
      dispatch({type:'TO_LOGIN_IN',usr,pwd});
    }
  }
}

export default connect(mapStateToProps,mapStateToDispatch)(Login);