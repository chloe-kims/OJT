import React from 'react';
import '../App.css';
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class SiderDemo extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<TeamOutlined />}>
              홈
            </Menu.Item>
            <Menu.Item key="2" icon={<PieChartOutlined />}>
              카드 관리
            </Menu.Item>
            <Menu.Item key="3" icon={<DesktopOutlined />}>
              결제 내역
            </Menu.Item>
            <SubMenu key="sub1" icon={<UserOutlined />} title="회원 정보">
              <Menu.Item key="4">비밀번호 변경</Menu.Item>
              <Menu.Item key="5">회원정보 수정</Menu.Item>
            </SubMenu>
            <Menu.Item key="6" icon={<FileOutlined />}>
              파일
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Admin</Breadcrumb.Item>
              <Breadcrumb.Item>User</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              Last Login: [DATE]
              <br/>[USER]님 어서오세요.
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>TmaxData ©2021 Created by Chloe</Footer>
        </Layout>
      </Layout>
    );
  }
}

function Main() {
  return (
    <SiderDemo />
  );
}

export default Main;

