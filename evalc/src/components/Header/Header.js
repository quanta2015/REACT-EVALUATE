import React, { Component }  from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router'

import './Header.css'
import logo from './img/logo.png'

class Header extends Component {


  doLogout = () => {
    localStorage.removeItem('userInfoState');
    this.props.dispatch({type:'TO_LOGIN_OUT'});
    this.props.history.push('/')
  }

  render() {  
    var { isLogin }=this.props;
    //取缓冲数据判断是否已经登录
    var s = JSON.parse(localStorage.getItem('userInfoState'));
    if (s!== null) {
      var storeIsLogin = parseInt(s.isLogin)
      if(!isNaN(storeIsLogin)){ 
        isLogin = storeIsLogin;
      }
    }
    

    return (
      
      <div className="g-logo">
        <div className="m-logo"><img src={logo} alt=""/></div>
        <div className="m-menu">
          { (isLogin === 1)? (
            <button className="m-logout" onClick={this.doLogout}>退出</button>
          ):null}
        </div>
      </div>
    )
  }
}

const mapStateToProps  = (state) => ({
  isLogin: state.isLogin
});

// export default  ;

export default withRouter(connect(mapStateToProps)(Header))