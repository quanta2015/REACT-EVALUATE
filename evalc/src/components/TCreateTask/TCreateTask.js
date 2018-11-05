import './TCreateTask.css';
import React, { Component }  from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { connect } from 'react-redux';
import $ from 'jquery';
import store from '../../store';
import { Form, Input, DatePicker, Button, Cascader, Tabs, Table } from 'antd';
const { TextArea } = Input;
const { RangePicker } = DatePicker;

moment.locale('zh-cn')

const columns = [{
  title: '任务编号',
  dataIndex: 'task_id',
  key: 'task_id',
}, {
  title: '班级',
  dataIndex: 'class_name',
  key: 'class_name',
}, {
  title: '任务标题',
  dataIndex: 'task_title',
  key: 'task_title',
}, {
  title: '开始日期',
  dataIndex: 'publish_date',
  key: 'publish_date',
}, {
  title: '终止日期',
  dataIndex: 'end_date',
  key: 'end_date',
}];


class TCreateTaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.tabsRef = React.createRef();
  }

  componentDidMount = ()=>  {
    //取下拉框班级数据
    this.props.getClass();
    this.props.getTask();
  }

  doSave = (e) => {
    //保存任务
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.save(this.state, store.getState().user.data.userid);
        $('.tab-task').find("[role='tab']").eq(1).trigger('click');
      }
    })
  }

  onChangeCls = (value) => {
    this.setState(...this.state, {taskCls: value[1]});
  }

  onChangeDR = (dates, dateStrings) => {
    this.setState(...this.state, {from: dateStrings[0], to: dateStrings[1]})
  }

  onChangeTabs = (e) => {
    if (parseInt(e,0) === 2) {
      this.props.getTask();
    }
  }

  render() {  
    var { cls, task } = this.props;
    const FormItem = Form.Item;
    const TabPane = Tabs.TabPane;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="g-createtask">
        <Tabs defaultActiveKey="1" ref={this.tabsRef} onChange={this.onChangeTabs}  className='tab-task'>
          <TabPane tab="添加任务" key="1">
            <Form horizontal="true">
              <FormItem id="task-class" label="任务班级：" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                {getFieldDecorator('task-class', { rules:[{required:true, message:'请选择班级!'}] })(
                  <Cascader options={cls} onChange={this.onChangeCls} placeholder="请选择班级..." id="task-cls"/>
                )}
              </FormItem>

              <FormItem id="task-dataranger" label="任务时间" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                {getFieldDecorator('task-data', { rules:[{required:true, message:'请选择日期!'}] })(
                  <RangePicker id="task-dataranger" ranges={{ '本月': [moment(), moment().endOf('month')], '1个月': [moment(), moment().add(30, 'days')] }  } onChange={this.onChangeDR}/>
                )}
              </FormItem>

              <FormItem  id="task-title" label="任务标题" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                {getFieldDecorator('task-title', { rules:[{required:true, message:'请输入标题!'}] })(
                  <Input id="task-title" placeholder="请输入任务标题..." />
                )}
              </FormItem>

              <FormItem  id="task-content" label="任务内容" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                {getFieldDecorator('task-content', { rules:[{required:true, message:'请输入任务内容!'}] })(
                  <TextArea type="textarea" id="task-content" autosize={{ minRows: 6 }} placeholder="请输入任务内容..." />
                )}
              </FormItem>

              <FormItem id="task-submit" label=" " labelCol={{span: 6}} wrapperCol={{span: 14}}>
                <Button type="primary" htmlType="button" onClick={this.doSave}>保存</Button>
              </FormItem>
            </Form>
          </TabPane>
          <TabPane tab="任务列表" key="2">
            <Table columns={columns} dataSource={task} />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

const mapStateToProps  = (state) => ({
  cls: state.class,
  ret: state.ret,
  task: state.task
});

const mapDispatchToProps=(dispatch)=>{
  return {
    save:(s,uid)=>{
      var data = {
        uid: uid,
        cls: s.taskCls,
        from: s.from,
        to: s.to,
        tl: document.getElementById('task-title').value,
        cnt:document.getElementById('task-content').value
      }
      dispatch({type:'TO_SAVE_TASK',data});
    },
    getClass:(e)=>{
      dispatch({type:'GET_CLASS'});
    },
    getTask:(e)=>{
      dispatch({type:'TO_GET_TASK'});
    }
  }
}

const TCreateTask = Form.create()(TCreateTaskForm);

export default  connect(mapStateToProps,mapDispatchToProps)(TCreateTask);