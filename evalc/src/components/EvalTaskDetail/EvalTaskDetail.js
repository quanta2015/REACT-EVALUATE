import React, { Component }  from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import './EvalTaskDetail.css';
import { Form, Button,Tabs, Row, Col, InputNumber } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;



var _id;

class EvalTaskDetailForm extends Component {


  doReturn = ()=> {
    this.props.history.push('/evaltask');
  }


  doSave = (e)=> {

    
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        var list = [];
        for(var i in values) {
          // console.log(i,":",values[i]);
          list.push(values[i]);
        }
        var data = list.join(',');
        var type = $(e.currentTarget).data('type');
        this.props.saveEval(data,type);
      }
    })
  }

  componentDidMount = ()=>  {
    _id = this.props.match.params.id;
    this.props.getEvalTaskDetail();
  }
  render =() => {
    const { getFieldDecorator } = this.props.form;
    var evalList = [];
    var evaltaskdetail, complete = 0, operations;

    if (typeof(this.props.evaltaskdetail) === "undefined") {
      evaltaskdetail = []
    }else{
      evaltaskdetail = this.props.evaltaskdetail.list;
      complete = this.props.evaltaskdetail.complete;
    }

    if(evaltaskdetail.length>0) {
      for(var i=0;i<4;i++) {
        evalList.push({ id: null, name: null, list: [] });
      }
      evaltaskdetail.map((item)=>{
          var obj = {}
          var id = parseInt(item.tid,0) - 1;
          evalList[id].id = item.tid;
          evalList[id].name = item.table_name;
          obj.title = item.item_title;
          obj.content = item.item_content;
          obj.point = item.item_point;
          obj.grade = item.grade;
          evalList[id].list.push(obj);
      }) 
    }

    if (complete === 0) {
      operations = <div>
      <Button type="primary" htmlType="button" icon="check" onClick={this.doSave} data-type="1">提交</Button>
      <Button type="primary" htmlType="button" icon="save" onClick={this.doSave}  data-type="0" >保存</Button>
      <Button type="primary" htmlType="button" icon="rollback" onClick={this.doReturn}>返回</Button>
      </div>;
    }else{
      operations = <div>
      <Button type="primary" htmlType="button" icon="rollback" onClick={this.doReturn}>返回</Button>
      </div>;
    }


    

    return (
      
      <div className="g-evaltask-detail">
        <Form layout="vertical" >
          <Tabs tabBarExtraContent={operations}>
            { evalList.map((item,i)=>{
              return ( 
                <TabPane tab={item.name} key={i}>
                  { item.list.map((o, j)=>{
                      return (
                        <FormItem key={j} >
                        <Row className='m-eval-row' gutter={0} type="flex" justify="space-around" align="middle">
                          <Col className="gutter-row" span={3}>
                            <div className="gutter-box">{o.title}</div>
                          </Col>
                          <Col className="gutter-row" span={17}>
                            <div className="gutter-box">{o.content}</div>
                          </Col>
                          <Col className="gutter-row fn-center" span={2} >
                            <div className="gutter-box">{o.point}</div>
                          </Col>
                          <Col className="gutter-row fn-center" span={2}>
                            { getFieldDecorator(`${i+1}-${j}` , { initialValue: o.grade, rules:[{required:true, message:'请输入数据!'}] })( <InputNumber min={0} max={o.point} size="small" /> )}
                          </Col>
                        </Row>
                        </FormItem>
                      )
                    }) }
                </TabPane>
               )
            }) }
          </Tabs>
        </Form>
      </div>
    )
  }
}

const mapStateToProps  = (state) => ({
  evaltaskdetail: state.evaltaskdetail
});

const mapDispatchToProps=(dispatch)=>{
  return {
    getEvalTaskDetail:()=>{
      var data = { id: _id }
      dispatch({type:'TO_GET_EVALTASK_DETAIL', data });
    },
    saveEval:(grade,type)=>{
      var data = {
        id: _id,
        grade: grade,
        type: type
      }
      dispatch({type:'TO_SAVE_EVALDETAIL',data});
    },
  }
}

const EvalTaskDetail = Form.create()(EvalTaskDetailForm);

export default  connect(mapStateToProps,mapDispatchToProps)(EvalTaskDetail);
