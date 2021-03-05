import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import 'antd/dist/antd.css';
import moment from 'moment';

import { Layout, Menu, Table, Button, Input, Pagination, Modal, DatePicker, Form, Radio } from 'antd';
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
const modanFormLayout = {
  labelCol: {
    span: 6,
  },
};
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

class PaymentTable extends React.Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    payment_data: [],
    deletePayIDs: [],
    loading: false,
    isAddPayDiagVisible: false,
    card_num: "",
    range: [moment("2021-01-01"), moment("2021-12-31")]
  };

  showAddPayDiag = () => {
    this.setState({ isAddPayDiagVisible: true });
  };
  
  hideAddPayDiag = () => {
    this.setState({ isAddPayDiagVisible: false });
  };

  loadData = () => {
    const id = window.sessionStorage.getItem('id');
    const data = {
      "header": {
          "DATA_TYPE": "3"
      },
      "dto": {
          "USER_ID": id // TODO:: Need to change from props
      }
    }
    axios.post('http://192.1.4.246:14000/AB3-5/OJTWEB/ReadPaymentTransactionAll?action=SO', data).then(response => {
      const temp  = response.data.dto.PaymentTransactionList;
      const data_source = [];
      for (let i = 0; i < temp.length; i++) {
        data_source.push({
          key: i,
          pay_id: temp[i].PAY_ID,
          date: temp[i].PAY_TIME.slice(0,10),
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

  onSearch = () => {
    this.setState({ loading: false })
    const date_start = this.state.range[0].format(dateFormat);
    const date_end = this.state.range[1].format(dateFormat);
    const card_num = this.state.card_num;
    const id = window.sessionStorage.getItem('id');
    if((date_start == null) || (date_end == null)){
      alert("날짜를 입력해주세요.");
    }else{
      const data = {
        "header": {
            "DATA_TYPE": "3"
        },
        "dto": {
            "USER_ID": id, // TODO:: Need to change from props
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
            date: temp[i].PAY_TIME.slice(0,10),
            card_num: temp[i].CARD_NUM.slice(0,4)+'-'+temp[i].CARD_NUM.slice(4,8)+'-'+temp[i].CARD_NUM.slice(8,12)+'-'+temp[i].CARD_NUM.slice(12,16),
            amount: temp[i].PAY_AMOUNT+'원',
            status: temp[i].PAY_STATUS === "E001" ? `승인` : `거절`,
            abroad: temp[i].PAY_ABROAD === `C001` ? `국내` : `해외`,
            memo: temp[i].PAY_MEMO
          });
        }
        this.setState({ payment_data: data_source, loading: true, selectedRowKeys: [] })
        //console.log('search data source:'+JSON.stringify(data_source));
      }).catch(error => {
      });
    }

  };

  addPayInfo = (payinfo) => {
    // var payDate = new Date(payinfo.payDate);
    const date = payinfo.payDate.format(dateFormat);
    const data = {
      "header": {
          "DATA_TYPE": "3"
      },
      "dto": {
        "PAY_ID": "00000111",
        "CARD_NUM": payinfo.cardNum,
        "PAY_TIME": date,
        "PAY_AMOUNT": payinfo.payAmount,
        "PAY_ABROAD": payinfo.payAbroad,
        "PAY_STATUS": payinfo.payApprov,
        "PAY_MEMO": payinfo.payMemo
      }
    }
    axios.post('http://192.1.4.246:14000/AB3-5/OJTWEB/InsertPaymentTransaction?action=SO', data).then(response => {
      console.log("post insert data: "+JSON.stringify(data));
      if (!('exception' in response)) {
        alert('결제 내역이 추가되었습니다.');
        setTimeout(() => {
          this.setState({isAddPayDiagVisible: false});
          this.loadData('admin');     // TODO:: Need to change from props
        }, 1000);
      } else {
        alert.error('결제 내역을 추가하는 도중 오류가 발생하였습니다.');
      }
      this.setState({ loading: false, selectedRowKeys: [] })
    });
  }

  deletePayInfo = () => {
    const payIdList = this.state.deletePayIDs;
    const id = window.sessionStorage.getItem('id');
    console.log('삭제할 payID: '+JSON.stringify(payIdList))
    var reqList = [];
    // for (let i = 0; i < payIdList.length; i++) {
    //   const data = {
    //     "header": {
    //         "DATA_TYPE": "3"
    //     },
    //     "dto": {
    //       "PAY_ID": payIdList[i]
    //     }
    //   }
    //   // console.log(data);
    //   reqList.push(axios.post('http://192.1.4.246:14000/AB3-5/OJTWEB/DeletePaymentTransaction?action=SO', data));
    // }
    // axios.all(reqList).then(
    //   axios.spread(function (results) {
    //     // console.log(results)
    //     let temp = results.map(r => r.data.dto);
    //     // console.log(temp)
    //     if (!('exception' in results)) {
    //       alert('결제 내역이 삭제되었습니다.');
    //     }
    //   })
    // ).catch((e) => console.log(e));

  }

  onSelectChange = selectedRowKeys => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    const data = this.state.payment_data;
    this.setState({ selectedRowKeys });
    var payIdList = [];
    for (let i = 0; i < selectedRowKeys.length; i++) {
      payIdList.push(data[selectedRowKeys[i]].pay_id)
    }
    // console.log('payIdList: '+JSON.stringify(payIdList));
    this.setState({ deletePayIDs: payIdList});
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
    const { loading, selectedRowKeys, card_num, isAddPayDiagVisible } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const data = this.state.payment_data;
    // console.log(data);
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
        <Button style={{ float: 'left', margin: '0 2px'  }} onClick={this.showAddPayDiag} >
          결제
        </Button>
        <Modal title="결제내역 추가" visible={isAddPayDiagVisible}
          onCancel={this.hideAddPayDiag}
          okText='추가' cancelText='취소'
          destroyOnClose={true}
          footer={[
          <Button form="addPayForm" type="primary"
            key="submit" htmlType="submit">
            결제 확인
          </Button>
          ]}
        >
        <Form id="addPayForm" onFinish={this.addPayInfo}
        initialValues={{payAbroad: 'C001', payApprov: 'E001'}} {...modanFormLayout}>

          <Form.Item name='cardNum' label='카드번호'
            rules={[
              {
                required: true,
                message: '필수 입력 항목입니다.',
              },
            ]}>
            <Input/>
          </Form.Item>
        
          <Form.Item name='payAmount' label='결제금액'
            rules={[
              {
                required: true,
                message: '필수 선택 항목입니다.',
              },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item name='payDate' label='거래일자'>
            <DatePicker picker='date' placeholder=''/>
          </Form.Item>

          <Form.Item name='payAbroad' label='국내외결제구분'
            rules={[
              {
                required: true,
                message: '필수 선택 항목입니다.',
              },
            ]}>
            <Radio.Group value='payAbroad'>
            <Radio.Button value='C001'>국내</Radio.Button>
            <Radio.Button value='C002'>해외</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item name='payApprov' label='승인여부'
            rules={[
              {
                required: true,
                message: '필수 선택 항목입니다.',
              },
            ]}>
            <Radio.Group value='payApprov'>
            <Radio.Button value='E001'>승인</Radio.Button>
            <Radio.Button value='E002'>거절</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item name='payMemo' label='추가사항'>
            <Input />
          </Form.Item>

        </Form>
        </Modal>
        <Button danger style={{ float: 'left', margin: '0 2px', marginRight: 10  }} onClick={this.deletePayInfo} disabled={!hasSelected} >
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
          <Header className="site-layout-background" style={{ padding: 0 }}>
            <Button onClick={this.handleClick} style={{ float: 'right', margin: 15}}>
              Logout
            </Button>
          </Header>
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

