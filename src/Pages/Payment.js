import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import 'antd/dist/antd.css';
import { Layout, Menu, Table, Button } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const columns = [
  {
    title: '거래일자',
    dataIndex: 'date',
  },
  {
    title: '승인번호',
    dataIndex: 'pay_id',
  },
  {
    title: '카드번호',
    dataIndex: 'card_num',
  },
  {
    title: '결제금액',
    dataIndex: 'amount',
  },
  {
    title: '승인여부',
    dataIndex: 'status',
  },
  {
    title: '국내외결제구분',
    dataIndex: 'abroad',
  },
  {
    title: '비고',
    dataIndex: 'memo',
  },
];

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    date: `2021/02/01 12:00:${i}`,
    pay_id: 20210226+`${i}`,
    card_num: `1234-****-****-1234`,
    amount: `${i}000`,
    status: `승인`,
    abroad: `국내`,
    memo: ``,
  });
}

class PaymentTable extends React.Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    payment_data: [],
    loading: false,
  };

  loadData = (id) => {
    const data = {
      "header": {
          "DATA_TYPE": "3"
      },
      "dto": {
          "USER_ID": 'admin' // TODO:: Need to change from props
      }
    }
    axios.post('http://192.1.4.246:14000/AB3-5/OJTWEB/ReadPaymentTransactionAll?action=SO', data).then(response => {
    const temp  = response.data.dto.PaymentTransactionList;
    const data_source = [];
    for (let i = 0; i < temp.length; i++) {
      data_source.push({
        key: i,
        pay_id: temp[i].PAY_ID,
        date: temp[i].PAY_TIME,
        card_num: temp[i].CARD_NUM,
        amount: temp[i].PAY_AMOUNT,
        status: temp[i].PAY_STATUS === "E001" ? `승인` : `거절`,
        abroad: temp[i].PAY_ABROAD === `C001` ? `국내` : `해외`,
        memo: temp[i].PAY_MEMO
      });
    }
    this.setState({payment_data: data_source})
    }).catch(error => {
    });
  }

  start = () => {
    this.setState({ loading: true });
    this.loadData('admin');
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  componentDidMount = (id) => {
    this.loadData(this.props.userid);
  }

  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const data = this.state.payment_data;
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" style={{ float: 'left' }} onClick={this.start} loading={loading}>
            검색
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      </div>
    );
  }
}

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
    const userid = this.props.userid;
    return (
      <Layout style={{ minHeight: '100vh' }}>
 <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['3']} mode="inline">
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
          <Content style={{ margin: '0 16px' }}>
            <PaymentTable userid={userid}/>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

function Payment({ userid }) {
  const userID = userid;
  return (
    <SiderDemo userid={userID}/>
  );
}

export default Payment;

