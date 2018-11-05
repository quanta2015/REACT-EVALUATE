import React, { Component }  from 'react'
import { connect } from 'react-redux';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SDoTask from "../SDoTask/SDoTask";
import EvalTask from "../EvalTask/EvalTask";
import SWatchResult from "../SWatchResult/SWatchResult";
import SDoTaskDetail from "../SDoTaskDetail/SDoTaskDetail";
import EvalTaskDetail from "../EvalTaskDetail/EvalTaskDetail";

import './SMainStu.css';

class SMainStu extends Component {
  constructor(props) {
    super(props);
    this.state = { }
  }

  render() {  
    return (
      <Router>
      <div className="g-mt">
        <div className="m-nav">
          <ul>
            <li>
              <Link to="/dotask">完成作业</Link>
            </li>
            <li>
              <Link to="/evaltask">评价作业</Link>
            </li>
            <li>
              <Link to="/watchresult">查看成绩</Link>
            </li>
          </ul>
        </div>
        <div className="m-mt">
          <Route path="/dotask" component={SDoTask} />
          <Route path="/evaltask" component={EvalTask} />
          <Route path="/watchresult" component={SWatchResult} />
          <Route path="/dotask-detail/:id" component={SDoTaskDetail} />
          <Route path="/evaltask-detail/:id" component={EvalTaskDetail} />
        </div>
      </div>
      </Router>
    );
  }
}

const mapStateToProps  = (state) => ({
  user: state.user,
  isLogin: state.isLogin
});

export default connect(mapStateToProps)(SMainStu);