import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { Form } from 'antd';
import store from '../../store';
import './SDoTask.css';
import $ from 'jquery';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn')


class SDoTaskForm extends Component {

  componentDidMount = ()=>  {
    this.props.getDoTask();
  }

  doTask = (e)=>{
    var id = $(e.currentTarget).data('id');
    this.props.history.push('/dotask-detail/'+id);
  }

  render() {  
    var { dotask } = this.props;
    if (typeof(dotask) === "undefined") {
      dotask = []
    }

    return (
      <div className="g-dotask">

        { dotask.map((item, i) =>{
            return(
              <div className= {(item.complete)?'m-taskitem finished':'m-taskitem'} key={i}>
                <div className="m-taskitem-title">{item.task_title}</div>
                <div className="m-taskitem-cnt">
                  <li>起：{moment(item.publish_date).format('YYYY-MM-DD')}</li>
                  <li>止：{moment(item.end_date).fromNow()}</li>
                </div>
                <div className="m-task-func" data-id={item.task_id}  onClick={this.doTask}>
                  <div className="m-filelist">
                    <li className={(item.ppt_url)?'':'fn-hide'}>{(item.ppt_url)?'P':''}</li>
                    <li className={(item.doc_url)?'':'fn-hide'}>{ (item.doc_url)?'D':''}</li>
                    <li className={(item.video_url)?'':'fn-hide'}>{ (item.video_url)?'V':''}</li>
                  </div>
                  <div className="m-do">详 情</div>
                </div>
              </div>
            )
        }) }
      </div>
    )
  }
}

const mapStateToProps  = (state) => ({
  dotask: state.dotask
});

const mapDispatchToProps=(dispatch)=>{
  return {
    getDoTask:(e)=>{
      var data = { uid: store.getState().user.data.userid }
      dispatch({type:'TO_GET_DOTASK', data });
    }
  }
}

const SDoTask = Form.create()(SDoTaskForm);

export default  connect(mapStateToProps,mapDispatchToProps)(SDoTask);
