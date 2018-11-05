import React, { Component }  from 'react'
import { connect } from 'react-redux';

import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import TCreateTask from "../TCreateTask/TCreateTask"
import EvalTask from "../EvalTask/EvalTask"
import TWatchResult from "../TWatchResult/TWatchResult"
import TAnalysis from "../TAnalysis/TAnalysis"
import EvalTaskDetail from "../EvalTaskDetail/EvalTaskDetail";
import TAnalysisDetail from "../TAnalysisDetail/TAnalysisDetail";


import './TMainTch.css'

class TMainTch extends Component {
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
              <Link to="/createtask">布置作业</Link>
            </li>
            <li>
              <Link to="/evaltask">评价作业</Link>
            </li>
            <li>
              <Link to="/watchresult">成绩结果</Link>
            </li>
            <li>
              <Link to="/analysis">统计分析</Link>
            </li>
          </ul>
        </div>
        <div className="m-mt">
          <Route path="/createtask" component={TCreateTask} />
          <Route path="/evaltask" component={EvalTask} />
          <Route path="/watchresult" component={TWatchResult} />
          <Route path="/analysis" component={TAnalysis} />
          <Route path="/evaltask-detail/:id" component={EvalTaskDetail} />
          <Route path="/analysis-detail/:id" component={TAnalysisDetail} />
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

export default connect(mapStateToProps)(TMainTch);