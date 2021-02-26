import React from 'react';
import tmax from '../tmax.gif';
import 'antd/dist/antd.css';
import '../App.css';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';


const NormalLoginForm = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <Form style={{margin: 'auto', maxWidth: '20%'}}
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: '아이디를 입력하세요.',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: '비밀번호를 입력하세요.',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Item>

      <Form.Item>
        <Button style={{ margin: '10px' }} type="primary" htmlType="submit" className="login-form-button">
          <Link to='/main'>Log in</Link>
        </Button>
        <br/>
        Or <Link to='/sign'>register now!</Link>
      </Form.Item>
    </Form>
  );
};

function Login({ location, history } ) {
  console.log(history);
  console.log(location);
    return (
      <div className="App">
        <header className="App-header">
          <a href="http://localhost:3000">
            <img src={tmax} className="App-logo" alt="logo" />
          </a>
          <NormalLoginForm/>
        </header>
      </div>
    );
}

export default Login;