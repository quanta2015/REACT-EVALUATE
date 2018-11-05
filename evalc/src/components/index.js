import React, { Component } from 'react';
import Header from './Header/Header';
import { connect } from 'react-redux';
import store from '../store'
import { withRouter } from 'react-router'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { username:'tom'};
    }

    componentDidMount=()=>{
        var s = JSON.parse(localStorage.getItem('userInfoState'));
        if (( s !== null )&&(JSON.stringify(s.user)!="{}")){
            var role = s.user.data.role;
            var usr = s.user.data.username;
            var pwd = s.user.data.password;
            this.props.store.dispatch({type:'TO_LOGIN_IN',usr,pwd});
            if(role===1) {
                this.props.history.push('/MainStu')
            }else{
                this.props.history.push('/MainTch')
            }
        }
    }

    render() {
        return (
            <div className="g-wrap">
                <Header></Header>
                <div className="g-main">
                    {this.props.children}
                </div> 
            </div>
        );
    }
}

export default withRouter(App);