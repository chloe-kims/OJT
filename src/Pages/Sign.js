import '../App.css';
import logo from '../logo.svg';
import React, { useState } from 'react';
import DaumPostcode from "react-daum-postcode";
import 'antd/dist/antd.css';

import {
  Form,
  Input,
  Tooltip,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  Modal,
  Space,
} from 'antd';
import { QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
const { Option } = Select;
const { Search } = Input;
const addresses = [
  {
    value: '국내',
    label: '국내',
    children: [
      {
        value: '서울특별시',
        label: '서울특별시',
        children: [
          {
            value: '강남구',
            label: '강남구',
          },
        ],
      },
    ],
  },
  {
    value: '해외',
    label: '해외',
    children: [
      {
        value: 'U.S.A',
        label: 'U.S.A',
        children: [
          {
            value: 'Boston',
            label: 'Boston',
          },
        ],
      },
    ],
  },
];
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
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);

  const websiteOptions = autoCompleteResult.map((website) => ({
    label: website,
    value: website,
  }));
  return (
    <Form style={{margin: 'auto', maxWidth: '25%'}}
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
            type: 'id',
            message: '사용할 수 없는 아이디입니다!',
          },
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
        rules={[
          {
            type: 'array',
            required: true,
            message: '법인 주소를 입력하세요!',
          },
        ]}
      >
        <ModalContainer/>
      </Form.Item>

      <Form.Item
        name="phone"
        label="대표자 이름"
        rules={[
          {
            required: true,
            message: '대표자 성함을 입력해주세요!',
          },
        ]}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        name="phone"
        label="대표 번호"
        rules={[
          {
            required: true,
            message: '전화번호를 입력하세요!',
          },
        ]}
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
            message: '유효한 이메일이 아닙니다!',
          },
          {
            required: true,
            message: '이메일을 입력해주세요!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phone"
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
          I have read the <a href="">agreement</a>
        </Checkbox>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

function Sign() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <RegistrationForm/>
        </header>
      </div>
    );
}

export default Sign;

