import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import 'antd/dist/antd.css';
import { Layout, Menu, Form, Input, Button, message } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const FormLayoutDemo = () => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState('horizontal');
  const [oldpw, setOldpw] = useState('admin');
  const [newpw, setNewpw] = useState('admin123');
  const [reqInProgress, setReqInProgress] = useState(false);

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


  const updatePw = () => {
    setReqInProgress(true);
    const id = window.sessionStorage.getItem('id');
    const old_data = {
      "header": {
          "DATA_TYPE": "3"
      },
      "dto": {
          "USER_ID": id
      }
    }

    axios.post('http://192.1.4.246:14000/AB3-5/OJTWEB/ReadUserAccount?action=SO', old_data).then(response => {
      console.log('old post data: '+JSON.stringify(old_data))
      // console.log(response)
      const id = window.sessionStorage.getItem('id');
      const p = response.data.dto.USER_PW;
      const n = response.data.dto.COMP_NM;
      const new_data = {
        "header": {
            "DATA_TYPE": "3"
        },
        "dto": {
            "USER_ID": id,
            "USER_PW": newpw,
            "COMP_NM": n        // TODO:: 비밀번호 변경용 SO 하나 더 만들기, 나머지가 null로 들어가니까 다 비워지게되어버림,,
        }
      }
      console.log(p, oldpw, newpw)
      if(oldpw === p){
        console.log('auth true!')
        axios.post('http://192.1.4.246:14000/AB3-5/OJTWEB/UpdateUserAccount?action=SO', new_data).then(response => {
          console.log('new post data: '+JSON.stringify(new_data))
          console.log('update')
          message.success('비밀번호가 변경되었습니다.')
          setReqInProgress(false)
        }).catch(error => {
          message.error('비밀번호 변경에 실패하였습니다.')
          setReqInProgress(false)
        });
      }
      // alert('비밀번호를 변경하였습니다.')
    }).catch(error => {
      message.error('잘못된 비밀번호입니다.')
      setReqInProgress(false)
    });
  }

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
          <Input.Password disabled={reqInProgress}/>
        </Form.Item>
        <Form.Item label="새로운 비밀번호">
          <Input.Password disabled={reqInProgress}/>
        </Form.Item>
        <Form.Item {...buttonItemLayout}>
          <Button type="primary" onClick={updatePw} loading={reqInProgress}>변경</Button>
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

  handleClick(){
    window.location.href = "http://localhost:3000";
    window.sessionStorage.clear();
    window.location.reload();
  }

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
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            <Button onClick={this.handleClick} style={{ float: 'right', margin: 15}}>
              Logout
            </Button>
          </Header>
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

