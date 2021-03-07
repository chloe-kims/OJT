import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import 'antd/dist/antd.css';
import moment from 'moment';

import { Layout, Menu, Table, Button, Input, Pagination, Modal, DatePicker, Form, Radio, message, Select } from 'antd';
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
const { Option } = Select;

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
    selectedPayID: [],
    cardList: [],
    loading: false,
    isAddPayDiagVisible: false,
    isDelPayDiagVisible: false,
    requestInProgress: false,
    card_num: "",
    range: [moment("2021-01-01"), moment("2021-12-31")]
  };

  showAddPayDiag = () => {
    this.setState({ isAddPayDiagVisible: true, isDelCardDiagVisible: false });
  };
  
  hideAddPayDiag = () => {
    this.setState({ isAddPayDiagVisible: false });
  };

  showDelPayDiag = () => {
    // set card data to process on del modal
    this.setState({
      isAddPayDiagVisible: false,
      isDelPayDiagVisible: true,
    });
  };

    
  // forceInputInPattern: if new value does not match pattern in input,
  //                      then it cancels the change
  //
  //                      - Prerequisites: need to set values of input as state
  //
  //                      Ex) <Input onInput={(e) => this.forceInputInPattern(e, 'stateName')}
  //                            value={stateName} ... />
  //
  forceInputInPattern = (e, inputValueStateName, pattern) => {
    //console.log('forceInputInPattern', e, inputValueStateName);
    let resultObj = {};
    resultObj[inputValueStateName] =
      e.target.value.match(pattern)
      ? e.target.value
      : this.state[inputValueStateName];
    
    this.setState(resultObj);
  }
  

  // hideDelCardDiag: hide del modal
  hideDelPayDiag = () => {
    this.setState({ isDelPayDiagVisible: false });
  };

  loadData = (id) => {
    this.setState({loading: true});
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
      // console.log(data_source)
      this.setState({ payment_data: data_source, loading: false });
    }).catch(error => {
      this.setState({ payment_data: [], loading: false });
      message.error('결제 내역을 불러오는 도중 오류가 발생하였습니다.');
    });
  }

  onSearch = () => {
    this.setState({ loading: true })
    const date_start = this.state.range[0].format(dateFormat);
    const date_end = this.state.range[1].format(dateFormat);
    const card_num = this.state.card_num;
    const id = window.sessionStorage.getItem('id');
    if((date_start == null) || (date_end == null)){
      message.error("날짜를 입력해주세요.");
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
        this.setState({ payment_data: data_source, loading: false, selectedRowKeys: [] });
        //console.log('search data source:'+JSON.stringify(data_source));
      }).catch(error => {
        this.setState({ payment_data: [], loading: false, selectedRowKeys: [] });
        message.error('결제 내역을 불러오는 도중 오류가 발생하였습니다.');
      });
    }

  };

  loadCardList = (id) => {
    // const id = window.sessionStorage.getItem('id');
    const data = {
      "header": {
          "DATA_TYPE": "3"
      },
      "dto": {
          "USER_ID": id
      }
    }
    axios.post('http://192.1.4.246:14000/AB3-5/OJTWEB/ReadPaymentCardList?action=SO', data).then(response => {
      const temp  = response.data.dto.paymentCardList;
      const card_data = [];
      for (let i = 0; i < temp.length; i++) {
        card_data.push({
          key: i,
          name: temp[i].CARD_NM+'('+temp[i].CARD_NUM.slice(-4,)+')'
        })
      }
      // console.log(card_data)
      this.setState({ cardList: card_data, loading: true})
    }).catch(error => {
      this.setState({ cardList: []});
    });
  }

  onCardChange = (value) => {
    console.log(value)
  }

  onCardSearch = (val) => {
    console.log(val)
  }

  addPayInfo = (payinfo) => {
    // var payDate = new Date(payinfo.payDate);
    this.setState({requestInProgress: true});
    const id = window.sessionStorage.getItem('id');
    
    const date = payinfo.payDate.format(dateFormat);
    const data = {
      "header": {
          "DATA_TYPE": "3"
      },
      "dto": {
        "PAY_ID": "0003133",
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
        message.success('결제 내역이 추가되었습니다.');
        setTimeout(() => {
          this.setState({isAddPayDiagVisible: false, requestInProgress: false});
          this.loadData(id);
        }, 1000);
      } else {
        message.error('결제 내역을 추가하는 도중 오류가 발생하였습니다.');
      }
      this.setState({ loading: false, selectedRowKeys: [], requestInProgress: false})
    });
  }

  delPayInfo = () => {
    this.setState({requestInProgress: true});

    const payIDList = this.state.selectedPayID;
    const id = window.sessionStorage.getItem('id');
    console.log('삭제할 payID: '+JSON.stringify(payIDList))
    const totalCount = payIDList.length;
    let finishedCount = 0;
    let succeededCount = 0;

    payIDList.forEach((pay_id) => {
      
      const reqOpt = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          header: {
            DATA_TYPE: '3'
          },
          dto: {
            PAY_ID: pay_id
          }
        })
      };
      console.log(reqOpt);
      let response = fetch('http://192.1.4.246:14000/AB3-5/OJTWEB/DeletePaymentTransaction?action=SO', reqOpt)
          .then(res => res.json());

      response.then(
        (responseJson) => {
          
          if (!('exception' in responseJson)) {
            succeededCount++;
            finishedCount++;
          } else {
            finishedCount++;
            console.log(responseJson);
          }

          if (finishedCount == totalCount) {
            if (succeededCount == totalCount) {
              message.success('카드가 삭제되었습니다.');
              this.loadData(id)
              
            } else {
              message.error('카드를 삭제하는 도중 오류가 발생하였습니다.');
            }
            this.setState({ isDelPayDiagVisible: false, requestInProgress: false, selectedRowKeys: []})
          }
        },
        () => {
          
          finishedCount++;
          
          if (finishedCount == totalCount) {
            message.error('카드를 삭제하는 도중 오류가 발생하였습니다.');
            this.setState({ isDelPayDiagVisible: false, requestInProgress: false});
          }
        }
      );
      
    });
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

  createConfirmModalForm = (formId, titleText, confirmText, visibleState, hideFunc, submitFunc) => {

    const { requestInProgress } = this.state;

    return (
        <Modal title={titleText} visible={visibleState}
      onCancel={hideFunc}
      destroyOnClose={true}
      footer={[
          <Button type="default" onClick={hideFunc}>
          취소
        </Button>,
          <Button form={formId} type="primary"
        key="submit" htmlType="submit" loading={requestInProgress}>
          확인
        </Button>
        ]}
        >
        <Form id={formId} onFinish={submitFunc}>
        
      {confirmText}
        
        </Form>
        </Modal>
    );
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
    this.setState({ selectedPayID: payIdList});
  };

  onChange = (e) => {
    this.setState({
      card_num: e.target.value
    });
  }

  componentDidMount = () => {
    const id = window.sessionStorage.getItem('id');
    this.loadData(id);
    this.loadCardList(id);
  }

  render() {
    const { loading, isDelPayDiagVisible, cardList, selectedRowKeys, card_num, isAddPayDiagVisible } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const data = this.state.payment_data;
    // console.log(cardList);
    var options = cardList.map(({key, name}) =><Option key={key} value={name}>{name}</Option>);
    //console.log(options)
    // console.log(data);
    // console.log('render data source: '+JSON.stringify(data));
    return (
      <div>
        <div style={{ marginTop: 10, marginBottom: 10, display: 'flex'}}>
        <RangePicker
          defaultValue={this.state.range}
          format={dateFormat}
          onChange={(value, dateString) => this.setState({ range: value })}
          style={{ marginRight: '2px' }}
        />
        <Search value={card_num} placeholder="카드번호" onSearch={this.onSearch}
          onInput={(e) => this.forceInputInPattern(e, 'card_num', /^\d{0,16}$/)} style={{ width: 200 }} />
        <Button style={{ marginLeft: 'auto'  }} onClick={this.showAddPayDiag} >
          추가
        </Button>
        <Modal title="결제" visible={isAddPayDiagVisible}
          onCancel={this.hideAddPayDiag}
          okText='추가' cancelText='취소'
          destroyOnClose={true}
          footer={[
            <Button form="addPayForm" type="secondary"
              onClick={this.hideAddPayDiag}>
              취소
            </Button>,
            <Button form="addPayForm" type="primary"
              key="submit" htmlType="submit">
              확인
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
            <Select
              showSearch
              style={{ width: 150 }}
              placeholder="카드목록"
              onChange={this.onCardChange}
              onSearch={this.onCardSearch}>
            {options}
            </Select>

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
        <Button danger style={{ float: 'right', margin: '0 2px'  }} onClick={this.showDelPayDiag} disabled={!hasSelected}>
        삭제
        </Button>
          {this.createConfirmModalForm("delForm", "결제내역 삭제",
                                   "선택된 결제 내역을 모두 삭제하시겠습니까?",
                                   isDelPayDiagVisible,
                                   this.hideDelPayDiag,
                                   this.delPayInfo)}
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} loading={loading} />
      </div>
    );
  }
}

class SiderDemo extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    //console.log(collapsed);
    this.setState({ collapsed });
  };

  handleClick(){
    window.location.href = "http://localhost:3000";
    window.sessionStorage.clear();
    window.location.reload();
  }
  
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

