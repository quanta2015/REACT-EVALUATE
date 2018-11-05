import React, { Component }  from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import $ from 'jquery';
import moment from 'moment';
import './SDoTaskDetail.css';
import { Form, Input, Button,Upload,Icon,message } from 'antd';
const { TextArea } = Input;
const FormItem = Form.Item;

const SYS_UPLOAD = 'http://localhost:4000/upload/';
var _index, _tid, _uid, _pid, _dtid, renderSave, _curItem;
var _init;
var hots = 'http://localhost:4000/'

const blankItem = {
  task_title:'',
  task_content:'',
}

class SDoTaskDetailForm extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.tabsRef = React.createRef();
    _curItem = blankItem;
    _init = 0;
  }

  state = {
    fl_ppt: [],
    fl_doc: [],
    fl_vdo: [],
    complete: null
  }

  componentDidMount = ()=>  {
    this.setState(...this.state, { complete: _curItem.complete });
  }

  doMark = (e) => {
    _index = $(e.currentTarget).data('id')
  }

  doSave = () => {
    this.props.saveTaskDetail();
  }

  doReturn = ()=> {
    this.props.history.push('/dotask');
  }

  onChange = (info)=> {
    let fileList = info.fileList;
    fileList = fileList.slice(-1);

    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功`);
      var path = info.file.response.data;

      fileList[0].name = path.split('/')[2];
      fileList[0].url = hots + path;

      switch(_index) {
        case 'ppt': this.setState(...this.state, { fl_ppt: fileList });_curItem.ppt_url = path;break;
        case 'doc': this.setState(...this.state, { fl_doc: fileList });_curItem.doc_url = path;break;
        case 'vdo': this.setState(...this.state, { fl_vdo: fileList });_curItem.video_url = path;break;
        default: break;
      }

      if (!((_curItem.doc_url)&&(_curItem.ppt_url)&&(_curItem.video_url))) {
        $('#saveBtn').addClass('fn-hide');
      }else if (parseInt(_curItem.complete,0) === 1){
        $('#saveBtn').addClass('fn-hide');
      }else{
        $('#saveBtn').removeClass('fn-hide');
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  }

  doInitFileList=()=>{
    console.log(_curItem);
    this.state.fl_ppt = [];
    this.state.fl_doc = [];
    this.state.fl_vdo = [];
    if (_curItem.ppt_url!==null) {
      this.state.fl_ppt.push({
        uid: 1,
        name: _curItem.ppt_url.split('/')[2],
        url: hots + _curItem.ppt_url
      });
    }
    if (_curItem.doc_url!==null) {
      this.state.fl_doc.push({
        uid: 1,
        name: _curItem.doc_url.split('/')[2],
        url: hots + _curItem.doc_url
      });
    }
    if (_curItem.video_url!==null) {
      this.state.fl_vdo.push({
        uid: 1,
        name: _curItem.video_url.split('/')[2],
        url: hots + _curItem.video_url
      });
    }
  }

  render =() => {
    var dotask = this.props.dotask;
    const config = {
      name: 'file',
      action: SYS_UPLOAD,
      data: { uid: _uid, tid: _tid, type: '' },
    };

    //深拷贝
    var confP = JSON.parse(JSON.stringify(config));
    confP.data.type = 'PPT';
    var confD = JSON.parse(JSON.stringify(config));
    confD.data.type = 'DOC';
    var confV = JSON.parse(JSON.stringify(config));
    confV.data.type = 'VIDEO';

    if (_init===0) {
      _tid = this.props.match.params.id;
      _uid = store.getState().user.data.userid;
      //取当前执行任务
      for(var i=0;i<dotask.length;i++) {
        if (parseInt(dotask[i].task_id,0) === parseInt(_tid,0)) {
          _curItem = dotask[i];
          _pid = _curItem.publisher;
          _dtid = _curItem.key;
          _init = 1;
          this.doInitFileList();
          break;
        }
      }
    }else{
      // this.doInitFileList();
      if (!((_curItem.doc_url)&&(_curItem.ppt_url)&&(_curItem.video_url))) {
        renderSave = 1;
      }else if (parseInt(_curItem.complete,0) === 1){
        renderSave = 1;
      }else{
        renderSave = 0;
      }
      // console.log(this.state.fl_vdo)
    }

    return (
      <div className="g-dotask-detail">
        <Form layout="vertical" >
          <FormItem id="task-date" >
            <div className="m-task-date">
              <div>
                <span>任务布置日期：{moment(_curItem.publish_date).format('YYYY-MM-DD')}</span>
              </div>
              <div>
                <span>任务截止日期：{moment(_curItem.end_date).fromNow()}</span>
              </div>
            </div>
          </FormItem>

          

          <FormItem id="task-title" >
            <Input id="task-title" value={_curItem.task_title} readOnly/> 
          </FormItem>

          <FormItem  id="task-content" >
            <TextArea type="textarea" id="task-content" autosize={{ minRows: 6 }} value={_curItem.task_content} readOnly/>
          </FormItem>

          <FormItem  id="task-content" >
            <div className="task-wrap">
              <li>
                <Upload {...confP} onChange={this.onChange} defaultFileList={this.state.fl_ppt} ><Button onClick={this.doMark} data-id='ppt'><Icon type="upload" />PPT</Button></Upload>
              </li>
              <li>
                <Upload {...confD} onChange={this.onChange} defaultFileList={this.state.fl_doc}><Button onClick={this.doMark} data-id='doc'><Icon type="upload" />DOC</Button></Upload>
              </li>
              <li>
                <Upload {...confV} onChange={this.onChange} defaultFileList={this.state.fl_vdo}><Button onClick={this.doMark} data-id='vdo'><Icon type="upload" />VIDEO</Button></Upload>
              </li>
            </div>
          </FormItem>

          <FormItem style={{ textAlign: 'center' }} >
            <Button type="primary" htmlType="button" icon="save" onClick={this.doSave} id='saveBtn' className={(renderSave)?'fn-hide':''}>保存</Button>
            <Button type="primary" htmlType="button" icon="rollback" onClick={this.doReturn}>返回</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

const mapStateToProps  = (state) => ({
  dotask: state.dotask
});

const mapDispatchToProps=(dispatch)=>{
  return {
    saveTaskDetail:()=>{
      var data = { uid: _uid, tid:_tid, pid:_pid, dtid: _dtid }
      dispatch({type:'SAVE_DOTASK_DETAIL', data });
    }
  }
}

const SDoTaskDetail = Form.create()(SDoTaskDetailForm);

export default  connect(mapStateToProps,mapDispatchToProps)(SDoTaskDetail);
