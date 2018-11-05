import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import './Sider.css';

// 引入Antd的导航组件
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;

class Sider extends Component {
  constructor(props) {
      super(props);
      this.state = {};
  }

  render() {
    return (
      <div id="leftMenu">
        <Menu theme="dark" defaultOpenKeys={['sub1']} mode="inline">
            <SubMenu key="sub1" title={<span>子菜单</span>}>
                <Menu.Item key="1"><Link to="/page1" replace>用redux-saga获取数据</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/page2" replace>测试路由</Link></Menu.Item>
            </SubMenu>
        </Menu>
      </div>
    );
  }
}

export default Sider