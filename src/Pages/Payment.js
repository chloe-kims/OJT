import React from 'react';
import { Link } from 'react-router-dom';
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
    dataIndex: 'id',
  },
  {
    title: '카드번호',
    dataIndex: 'num',
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
];

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    date: `2021/02/01 12:00:${i}`,
    id: 20210226+`${i}`,
    num: `1234-****-****-1234`,
    amount: `${i}000`,
    status: `승인`,
    abroad: `국내`,
  });
}

class PaymentTable extends React.Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
  };

  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
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

  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" style={{ float: 'left' }} onClick={this.start} disabled={!hasSelected} loading={loading}>
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
            <PaymentTable/>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

function Payment() {
  return (
    <SiderDemo />
  );
}

export default Payment;

