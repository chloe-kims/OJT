import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import 'antd/dist/antd.css';
import { Layout, Menu, Form, Input, Button } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const FormLayoutDemo = () => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState('horizontal');

  const onFormLayoutChange = ({ layout }) => {
    setFormLayout(layout);
  };

  const formItemLayout =
    formLayout === 'horizontal'
      ? {
          labelCol: {
            span: 4,
          },
          wrapperCol: {
            span: 14,
          },
        }
      : null;
  const buttonItemLayout =
    formLayout === 'horizontal'
      ? {
          wrapperCol: {
            span: 14,
            offset: 4,
          },
        }
      : null;
  return (
    <>
      <Form style = {{margin: 'auto', maxWidth: '50%', paddingRight: '30px'}}
        {...formItemLayout}
        layout={formLayout}
        form={form}
        initialValues={{
          layout: formLayout,
        }}
        onValuesChange={onFormLayoutChange}
      >
        <Form.Item label="현재 비밀번호">
          <Input />
        </Form.Item>
        <Form.Item label="새로운 비밀번호">
          <Input />
        </Form.Item>
        <Form.Item {...buttonItemLayout}>
          <Button type="primary">변경</Button>
        </Form.Item>
      </Form>
    </>
  );
};

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
          <Menu theme="dark" defaultOpenKeys={['sub1']} defaultSelectedKeys={['4']} mode="inline">
            <Menu.Item key="1" icon={<TeamOutlined />}>
              <Link to="/main">홈</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<PieChartOutlined />}>
              <Link to="/card">카드 관리</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<DesktopOutlined />}>
              <Link to="/payment">결제 내역</Link>
            </Menu.Item>
            <SubMenu key="sub1" icon={<UserOutlined />} title="회원 정보">
              <Menu.Item key="4"><Link to="/userinfo/pw">비밀번호 변경</Link></Menu.Item>
              <Menu.Item key="5"><Link to="/userinfo/change">회원정보 수정</Link></Menu.Item>
            </SubMenu>
            <Menu.Item key="6" icon={<FileOutlined />}>
              <Link to="/file">파일</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '150px' }}>
            <FormLayoutDemo />
          </Content>
        </Layout>
      </Layout>
    );
  }
}

function UserInfoPw() {
  return (
    <SiderDemo />
  );
}

export default UserInfoPw;

