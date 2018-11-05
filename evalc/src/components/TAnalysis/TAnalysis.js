import React, { Component }  from 'react';
import { connect } from 'react-redux';
import './TAnalysis.css';
import { Form, Pagination,  Tabs, Table } from 'antd';
const TabPane = Tabs.TabPane;

var PAGE_SIZE = 8;

const columns = [{
  title: '编号',
  dataIndex: 'key',
  key: 'key',
}, {
  title: '任务名称',
  dataIndex: 'title',
  key: 'title',
}, {
  title: '最高分',
  dataIndex: 'max',
  key: 'max',
}, {
  title: '最低分',
  dataIndex: 'min',
  key: 'min',
}, {
  title: '平均分',
  dataIndex: 'avg',
  key: 'avg',
}, {
  title: '统计人数',
  dataIndex: 'count',
  key: 'count',
}, {
  title: '功能',
  key: 'action',
  render: (text, record) => (
    <span className="m-detail">
      <a href="javascript:;" onClick={this.detail}>详情</a>
    </span>
  ),
}];

class TAnalysisForm extends Component {
  constructor(props) {
    super(props);
    this.state = { idx: 1 }
  }

  doDetail = (id)=> {
    this.props.history.push('/analysis-detail/'+id);
  }

  componentDidMount = ()=>  {
    this.props.getAnalysisList();
  }

  onChange = (e) => {
    this.setState(...this.state, {idx: e})
  }

  render() {  
    var data = [];
    var ret = this.props.analysisList;
    var idx = this.state.idx;

    if (typeof(ret)!=="undefined") {
      var total = ret.length;
      for(var i=0;i<PAGE_SIZE;i++) {
        var offset = (idx-1)*PAGE_SIZE;
        if (offset + i>=ret.length) break;
        var item = ret[i + offset];
        data.push(item);
      }
      console.log(data)
    }

    return (
      <div className="g-analysis"> 
        <div className="m-wrap">
          <Table columns={columns} dataSource={data} onRow={(record)=>{
            return {
              onClick: this.doDetail.bind(this,record.key)
            }
          }}/>
        </div>
        <Pagination onChange={this.onChange} total={total} defaultPageSize={PAGE_SIZE}/>
      </div>
    )
  }
}


const mapStateToProps  = (state) => ({
  analysisList: state.analysisList,
  idx: state.idx
});

const mapDispatchToProps=(dispatch)=>{
  return {
    getAnalysisList:(e)=>{
      dispatch({type:'TO_GET_ANALYSIS_LIST'});
    }
  }
}

const TAnalysis = Form.create()(TAnalysisForm);

export default  connect(mapStateToProps,mapDispatchToProps)(TAnalysis);