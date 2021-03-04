import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import 'antd/dist/antd.css';
import moment from 'moment';

import { Layout, Menu, Table, Button, Input, Pagination, DatePicker, Space } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;
const { RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';

const columns = [
  {
    title: '승인번호',
    dataIndex: 'pay_id',
    width: '16%'
  },
  {
    title: '카드번호',
    dataIndex: 'card_num',
    width: '20%'
  },
  {
    title: '국내외결제구분',
    dataIndex: 'abroad',
    width: '10%'
  },
  {
    title: '승인여부',
    dataIndex: 'status',
    width: '10%'
  },
  {
    title: '결제금액',
    dataIndex: 'amount',
    width: '12%'
  },
  {
    title: '거래일자',
    dataIndex: 'date',
    width: '17%'
  },
  {
    title: '비고',
    dataIndex: 'memo',
    width: '15%'
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
    card_num: "",
    range: [moment("2021-01-01"), moment("2021-12-31")]
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
          date: temp[i].PAY_TIME.slice(0,19),
          card_num: temp[i].CARD_NUM.slice(0,4)+'-'+temp[i].CARD_NUM.slice(4,8)+'-'+temp[i].CARD_NUM.slice(8,12)+'-'+temp[i].CARD_NUM.slice(12,16),
          amount: temp[i].PAY_AMOUNT+'원',
          status: temp[i].PAY_STATUS === "E001" ? `승인` : `거절`,
          abroad: temp[i].PAY_ABROAD === `C001` ? `국내` : `해외`,
          memo: temp[i].PAY_MEMO
        });
      }
      this.setState({payment_data: data_source, loading: true})
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

  onSearch = (id) => {
    this.setState({ loading: false })
    const date_start = this.state.range[0].format(dateFormat);
    const date_end = this.state.range[1].format(dateFormat);
    const card_num = this.state.card_num;
    if((date_start == null) || (date_end == null)){
      alert("날짜를 입력해주세요.");
    }else{
      const data = {
        "header": {
            "DATA_TYPE": "3"
        },
        "dto": {
            "USER_ID": 'admin', // TODO:: Need to change from props
            "CARD_NUM": card_num,
            "PAY_TIME_START": date_start,   // NOT NULL
            "PAY_TIME_END": date_end      // NOT NULL
        }
      }
      axios.post('http://192.1.4.246:14000/AB3-5/OJTWEB/ReadPaymentTransactionFromDate?action=SO', data).then(response => {
        //console.log("post data: "+JSON.stringify(data));
        const temp  = response.data.dto.PaymentTransactionList;
        const data_source = [];
        for (let i = 0; i < temp.length; i++) {
          data_source.push({
            key: i,
            pay_id: temp[i].PAY_ID,
            date: temp[i].PAY_TIME.slice(0,19),
            card_num: temp[i].CARD_NUM.slice(0,4)+'-'+temp[i].CARD_NUM.slice(4,8)+'-'+temp[i].CARD_NUM.slice(8,12)+'-'+temp[i].CARD_NUM.slice(12,16),
            amount: temp[i].PAY_AMOUNT+'원',
            status: temp[i].PAY_STATUS === "E001" ? `승인` : `거절`,
            abroad: temp[i].PAY_ABROAD === `C001` ? `국내` : `해외`,
            memo: temp[i].PAY_MEMO
          });
        }
        this.setState({ payment_data: data_source, loading: true })
        //console.log('search data source:'+JSON.stringify(data_source));
        // window.location.reload(); // data source 업뎃후에 어떻게 리프레쉬할지 생ㅇ각.

      }).catch(error => {
      });
    }
  };

  onAdd = () => {
    this.setState({ loading: true });
    console.log('add');
  };

  onDelete = () => {
    this.setState({ loading: true });
    console.log('delete');
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  onChange = (e) => {
    this.setState({
      card_num: e.target.value
    });
  }

  componentDidMount = (id) => {
    this.loadData(this.props.userid);
  }

  render() {
    const { loading, selectedRowKeys, card_num } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const data = this.state.payment_data;
    // console.log('render data source: '+JSON.stringify(data));
    return (
      <div>
        <div style={{ marginTop: 10, marginBottom: 10, display: 'flex'}}>
        <Search value={card_num} placeholder="카드번호" onSearch={this.onSearch} onChange={this.onChange} style={{ width: 200 }} />
        <RangePicker
          defaultValue={this.state.range}
          format={dateFormat}
          onChange={(value, dateString) => this.setState({ range: value })}
        />
        <Button style={{ float: 'left', margin: '0 2px'  }} onClick={this.onAdd} >
          결제
        </Button>
        <Button danger style={{ float: 'left', margin: '0 2px', marginRight: 10  }} onClick={this.onDelete} disabled={!hasSelected} >
          삭제
        </Button>
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

