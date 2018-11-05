import React, { Component }  from 'react';
import { connect } from 'react-redux';
import './TWatchResult.css';
import { Form, Pagination,  Tabs, Table } from 'antd';
const TabPane = Tabs.TabPane;

var _size = 8;

const columns = [{
  title: '编号',
  dataIndex: 'id',
  key: 'id',
}, {
  title: '任务',
  dataIndex: 'title',
  key: 'title',
}, {
  title: '学生',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '学号',
  dataIndex: 'username',
  key: 'username',
}, {
  title: '成绩',
  dataIndex: 'g',
  key: 'g',
}];

class TWatchResultForm extends Component {
  constructor(props) {
    super(props);
    this.state = { idx: 1 }
  }


  componentDidMount = ()=>  {
    this.props.getResult();
  }

  onChange = (e) => {
    this.setState(...this.state, {idx: e})
  }

  render() {  
    var data = [];
    var { result } = this.props;
    var idx = this.state.idx;

    if (typeof(result)!=="undefined") {
      var total = result.length;
      for(var i=0;i<_size;i++) {

        var offset = (idx-1)*_size;
        if (offset + i>=result.length) break;
        var item = result[i + offset];

        item.evalListS = [];
        item.evalListT = [];
        if (item.eval !== null) {
          
          var list = item.eval.split(',');
          for(var j=0;j<list.length;j++) {
            var obj = {};
            var arr = list[j].split('-');
            obj.complete = arr[0];
            obj.name = arr[1];
            obj.role = arr[2];
            obj.grade = arr[3];

            if( parseInt(obj.role,0)===1) {
              item.evalListS.push(obj)
            }else{
              item.evalListT.push(obj)
            }
          }
        }else{
          var tmp = {name: '', grade: 0}
          item.evalListS.push(tmp);
          item.evalListS.push(tmp);
          item.evalListS.push(tmp);
          item.evalListS.push(tmp);
          item.evalListT.push(tmp);
        }
        item.g = parseInt(item.g,0)
        data.push(item);
      }
      console.log(data)
    }

    return (
      <div className="g-watchresult">
        <Tabs defaultActiveKey="1" ref={this.tabsRef} onChange={this.onChangeTabs}  className='tab-task'>
          <TabPane tab="成绩列表" key="1">
            <Table columns={columns} dataSource={result} />
          </TabPane>
          <TabPane tab="成绩分析" key="2">
            <div className="m-wrap">
            {data.map((item)=>{
              return (
                <div className="m-result" key={item.id}>
                  <div className="m-task-title">{item.title}</div>
                  <div className="m-task-stu">
                    <span className="m-stu-id">{item.name}</span>
                    <span className="m-stu-name">{item.username}</span>
                  </div>
                  <div className="m-grade-wrap">
                    <div className="m-grade">{item.g}</div>
                    <div className="m-eval">
                      {item.evalListT.map((t,k)=>{
                        return (
                          <div className="m-eval-t" key={k}>
                            <span className="m-eval-name">{t.name}</span>
                            <span className="m-eval-ret">{t.grade}</span>
                          </div>
                        )
                      })}

                      {item.evalListS.map((t,k)=>{
                        return (
                          <div className="m-eval-s" key={k}>
                            <span className={(t.name === item.name)?'m-eval-name m-red':'m-eval-name'}>{t.name}</span>
                            <span className="m-eval-ret">{t.grade}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
            </div>
            <Pagination onChange={this.onChange} total={total} defaultPageSize={_size}/>
          </TabPane>
          <TabPane tab="成绩图表" key="3">
            
          </TabPane>
        </Tabs>
      </div>
    )
  }
}


const mapStateToProps  = (state) => ({
  result: state.result,
  idx: state.idx
});

const mapDispatchToProps=(dispatch)=>{
  return {
    getResult:(e)=>{
      dispatch({type:'TO_GET_RESULT'});
    }
  }
}

const TWatchResult = Form.create()(TWatchResultForm);

export default  connect(mapStateToProps,mapDispatchToProps)(TWatchResult);