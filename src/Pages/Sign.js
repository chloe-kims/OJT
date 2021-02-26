import '../App.css';
import tmax from '../tmax.gif';
import React, { useState } from 'react';
import DaumPostcode from "react-daum-postcode";
import 'antd/dist/antd.css';

import {
  Form,
  Input,
  Tooltip,
  Select,
  Checkbox,
  Button,
  Modal,
  Space,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
const { Option } = Select;
const { Search } = Input;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const Postcode = () => {
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = ''; 
    
    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }

    console.log(fullAddress);  // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
  }

  return (
    <DaumPostcode
      onComplete={handleComplete}
    />
  );
}

const ModalContainer = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Space direction="vertical" onClick={showModal} style={{ width: '100%' }}>
        <Search placeholder="우편번호 검색" />
      </Space>
      <Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Postcode/>
      </Modal>
    </>
  );
};

const RegistrationForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="82">+82</Option>
        <Option value="1">+1</Option>
      </Select>
    </Form.Item>
  );

  return (
    <Form style={{margin: 'auto', maxWidth: '30%'}}
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        residence: ['국내', '서울', '강남구'],
        prefix: '82',
      }}
      scrollToFirstError
    >
      <Form.Item
        name="id"
        label="ID"
        rules={[
          {
            required: true,
            message: '아이디를 입력해주세요!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="비밀번호"
        rules={[
          {
            required: true,
            message: '비밀번호를 입력해주세요!',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="비밀번호 확인"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: '비밀번호를 다시 입력해주세요!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject('비밀번호가 일치하지 않습니다!');
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="comp_nm"
        label="법인명"
        rules={[
          {
            required: true,
            message: '법인 이름을 입력하세요!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="comp_reg"
        label={
          <span>
            사업자등록번호&nbsp;
            <Tooltip title="하이픈(-)을 제외한 숫자만 입력하세요.">
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        }
        rules={[
          {
            required: true,
            message: '사업자등록번호를 입력하세요!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="address"
        label="주소"
      >
        <ModalContainer/>
      </Form.Item>

      <Form.Item
        name="ceo_nm"
        label="대표자 이름"
      >
        <Input/>
      </Form.Item>

      <Form.Item
        name="ceo_phone"
        label="대표 번호"
      >
        <Input
          addonBefore={prefixSelector}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>

      <Form.Item
        name="email"
        label="대표 이메일"
        rules={[
          {
            type: 'email',
            message: '유효한 이메일이 아닙니다.',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="birth"
        label="생년월일"
      >
        <Input/>
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject('Should accept agreement'),
          },
        ]}
        {...tailFormItemLayout}
      >
        <Checkbox>
          나는 <a href="https://kr.tmaxsoft.com/bbs.do?cms_cd=ETC_90">개인정보 처리방침</a>를 읽었으며, 이에 동의합니다.
        </Checkbox>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          회원가입
        </Button>
      </Form.Item>
    </Form>
  );
};

function Sign() {
    return (
      <div className="App">
        <header className="App-header">
          <a href="http://localhost:3000">
            <img src={tmax} className="App-logo" alt="logo" />
          </a>
          <RegistrationForm/>
        </header>
      </div>
    );
}

export default Sign;

