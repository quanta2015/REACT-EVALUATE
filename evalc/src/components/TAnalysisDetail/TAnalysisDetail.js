import React, { Component }  from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import './TAnalysisDetail.css';
import { Form, Button,Tabs, Row, Col, InputNumber } from 'antd';
import ReactHighcharts from 'react-highcharts';
import Highcharts from 'highcharts';
const HighchartsExporting = require('highcharts-exporting')
HighchartsExporting(ReactHighcharts.Highcharts)
require('highcharts-export-csv')(ReactHighcharts.Highcharts)

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

var _id;

class TAnalysisDetailForm extends Component {

  doReturn = ()=> {
    this.props.history.push('/analysis');
  }

  componentDidMount = ()=>  {
    _id = this.props.match.params.id;
    this.props.getAnalysisDetail();

    // let chart = this.refs.chart.getChart();
    // console.log(chart.getCSV())
  }

  render =() => {
    var cateList = [];
    var dataList = [{
      name: '教师评价', data: []
    }, {
      name: '学生自评', data: []
    }, {
      name: '同学评价', data: []
    }]

    var analysisDetail = this.props.analysisDetail;

    if (typeof(analysisDetail)!=='undefined') {
      var ret = analysisDetail.grade;
      var conf = analysisDetail.conf;
      var teach_ratio, self_ratio, student_ratio;

      conf.map(item=>{
        if (item.type === 'teach_ratio') {
          teach_ratio = item.val
        }else if (item.type === 'student_ratio') {
          student_ratio = item.val
        }else if (item.type === 'self_ratio') {
          self_ratio = item.val
        }
      })

      console.log(ret)

      ret.map((item)=>{
        var arr = item.eval.split(',');
        var stuEval = 0;
        arr.map(obj=>{
          var d = obj.split('-');
          var g = parseInt(d[3],0)
          if (d[1] === item.name) {
            dataList[1].data.push( parseInt(g * self_ratio,0) );
          } else if(parseInt(d[2],0) === 0) {
            dataList[0].data.push( parseInt(g * teach_ratio,0) );
          } else {
            stuEval += parseInt(g);
          }
        })
        var sg = parseInt(stuEval/3 * student_ratio,0);
        dataList[2].data.push(sg);
        cateList.push(item.name)
      })
    }
    
    console.log(dataList);

    var config = {
      chart: { type: 'bar' },
      colors: ['#ff6600','#336699','#009933'],
      title: { text: '超级C程序作业' },
      xAxis: { categories: cateList },
      yAxis: { min: 0, title: { text: '' }, stackLabels:{enabled:true}},
      legend: { reversed: true },
      plotOptions: {
        series: { stacking: 'normal' },
        bar: {
          dataLabels: {
            enabled: true,
            allowOverlap: true // 允许数据标签重叠
          }
        }
      },
      series: dataList
    }

    
    return (
      <div className="g-analysis-detail">
        <div className="m-me">
          <Button onClick={this.doReturn}>返回</Button>
        </div>
        <ReactHighcharts config={config} ref="chart"></ReactHighcharts>
      </div>
    )
  }
}

const mapStateToProps  = (state) => ({
  analysisDetail: state.analysisDetail
});

const mapDispatchToProps=(dispatch)=>{
  return {
    getAnalysisDetail:()=>{
      var data = { id: _id }
      dispatch({type:'TO_GET_ANALYSIS_DETAIL', data });
    }
  }
}

const TAnalysisDetail = Form.create()(TAnalysisDetailForm);
export default  connect(mapStateToProps,mapDispatchToProps)(TAnalysisDetail);
