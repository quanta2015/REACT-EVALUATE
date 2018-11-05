import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { Form, Pagination, Select} from 'antd';
import store from '../../store';
import './EvalTask.css';
import $ from 'jquery';

const Option = Select.Option;
const PAGE_SIZE = 8;
var _complete = 0;

class EvalTaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = { idx: 1 }
  }

  componentDidMount = ()=>  {
    this.props.getEvalTask();
  }

  evalTask = (e)=>{
    if(e.target===this){ }
    var id = $(e.currentTarget).data('id');
    this.props.history.push('/evaltask-detail/'+id);
  }

  stop = (e)=>{
    e.stopPropagation();
  }

  onChange = (e) => {
    this.setState(...this.state, {idx: e})
  }

  handleCondition = (e)=> {
    _complete = e;
    this.props.getEvalTask();
  }

  render() {  
    var { evaltask } = this.props;
    if (typeof(evaltask) === "undefined") {
      evaltask = []
    }

    var total = evaltask.length;
    var idx = this.state.idx;
    var data = [];

    for(var i=0;i<PAGE_SIZE;i++) {
      var offset = (idx-1)*PAGE_SIZE;
      if (offset + i>=evaltask.length) break;
      var item = evaltask[i + offset];
      data.push(item);
    }

    return (
      <div className="g-evaltask">
        <div className="m-menu">
        <Select defaultValue="未评价" style={{ width: 120 }} onChange={this.handleCondition}>
          <Option value="0">未评价</Option>
          <Option value="1">已评价</Option>
        </Select>
        </div>
        <div className="m-wrap">
        { data.map((item, i) =>{
            return(
              <div className= {(item.complete)?'m-taskitem finished':'m-taskitem'} key={i}>
                <div className="m-taskitem-title">{item.task_title}</div>
                <div className="m-taskitem-cnt">
                  <div className="m-taskitem-detail">
                    <li>姓名：{item.name}</li>
                    <li>学号：{item.username}</li>
                  </div>
                  <div className="m-taskitem-g">
                    <span>{item.g}</span>
                  </div>
                  
                </div>
                <div className="m-task-func" data-id={item.id} onClick={this.evalTask}>
                  <div className="m-filelist">
                    <a href={item.ppt_url} target="_blank"><li className={(item.ppt_url)?'':'fn-hide'} onClick={this.stop}>{(item.ppt_url)?'P':''}</li></a>
                    <a href={item.doc_url} target="_blank"><li className={(item.doc_url)?'':'fn-hide'} onClick={this.stop}>{ (item.doc_url)?'D':''}</li></a>
                    <a href={item.video_url} target="_blank"><li className={(item.video_url)?'':'fn-hide'} onClick={this.stop}>{ (item.video_url)?'V':''}</li></a>
                  </div>
                  <div className="m-do">评 价</div>
                </div>
              </div>
            )
        }) }
        </div>
        <Pagination onChange={this.onChange} total={total} defaultPageSize={PAGE_SIZE}/>
      </div>
    )
  }
}

const mapStateToProps  = (state) => ({
  evaltask: state.evaltask,
  idx: state.idx, 
});

const mapDispatchToProps=(dispatch)=>{
  return {
    getEvalTask:(e)=>{
      var data = { uid: store.getState().user.data.userid, complete: _complete }
      dispatch({type:'TO_GET_EVALTASK', data });
    }
  }
}

const EvalTask = Form.create()(EvalTaskForm);

export default  connect(mapStateToProps,mapDispatchToProps)(EvalTask);

