import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import 'antd/dist/antd.css';
import { Layout, Menu, Table, Button, Input, Pagination, Modal, Form, Radio, DatePicker, Select, message } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  DownOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;
const { Option } = Select;

// config
const reqBaseUrl = 'http://192.1.4.246:14000/AB3-5/OJT/';
const username = 'admin';
const pageSizeDefault = 10;
const modanFormLayout = {
  labelCol: {
    span: 6,
  },
};

// table columns
const columns = [
  {
    title: '카드명',
    dataIndex: 'cardName',
    width: '13%',
  },
  {
    title: '카드사',
    dataIndex: 'cardCompany',
    width: '13%',
  },
  {
    title: '카드번호',
    dataIndex: 'cardNum',
    width: '20%',
  },
  {
    title: '결제계좌은행명',
    dataIndex: 'bank',
    width: '13%',
  },
  {
    title: '결제계좌번호',
    dataIndex: 'bankAccount',
    width: '20%',
  },
  {
    title: '유효기간',
    dataIndex: 'cardExpirationDate',
    width: '13%',
  },
  {
    title: '상태',
    dataIndex: 'cardStatus',
    width: '8%',
  },
];




class CardTable extends React.Component {

  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: true,
    cardcoList: [],
    bankList: [],
    cardData: [],
    maxDataCount: -1,
    pageSize: pageSizeDefault,
    searchString: null,
    isAddCardDiagVisible: false,
    isModCardDiagVisible: false,
    requestInProgress: false,
  };

  start = () => {
    this.setState({ loading: true });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  onPageChange = (page, pageSize) => {
    this.setState({ pageSize: pageSize });
  }

  
  
  //////////////////// data fetch ////////////////////

  // getCodeList: get available codename list
  getCodeList = () => {
    
    // POST request
    const reqOpt = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        header: {
          DATA_TYPE: 'J'
        }
      })
    };

    // send request & get response (card company list)
    let response = fetch(reqBaseUrl + 'GetCardcoList?action=SO', reqOpt)
        .then(res => res.json());
    
    // response handling
    response.then(
      (responseJson) => {
        let newState = {cardcoList: null};
        
        // received data successfully
        if ('dto' in responseJson && 'STR_VAL' in responseJson.dto) {
          
          // map data from json
          let mappedData = responseJson.dto.STR_VAL.map((cardco, idx) => ({
            key: idx,
            value: cardco.STR_VAL
          }));
          
          // compose dropdown menu
          newState.cardcoList = mappedData.map((cardco) =>
                                               <Option value={cardco.value}>{cardco.value}</Option>
                                              );
        }

        // no data received
        else {
          if ('exception' in responseJson) { 
            message.error('서버와 연결할 수 없습니다.');
          } else {
            message.error('카드사 목록이 존재하지 않습니다.');
          }
        }
        
        this.setState(newState);
      },
      
      // connection fail
      () => {
        message.error('서버와 연결할 수 없습니다.');
        this.setState({cardcoList: null});
      }
    );

    // send request & get response (bank list)
    response = fetch(reqBaseUrl + 'GetBankList?action=SO', reqOpt)
      .then(res => res.json());
    
    // response handling
    response.then(
      (responseJson) => {
        let newState = {bankList: null};
        
        // received data successfully
        if ('dto' in responseJson && 'STR_VAL' in responseJson.dto) {

          // map data from json
          let mappedData = responseJson.dto.STR_VAL.map((bank, idx) => ({
            key: idx,
            value: bank.STR_VAL
          }));
          
          // compose dropdown menu
          newState.bankList = mappedData.map((bank) =>
                                             <Option value={bank.value}>{bank.value}</Option>
                                            );
        }
        
        // no data received
        else {
          if ('exception' in responseJson) { 
            message.error('서버와 연결할 수 없습니다.');
          } else {
            message.error('은행 목록이 존재하지 않습니다.');
          }
        }
        this.setState(newState);
      },
      
      // connection fail
      () => {
        message.error('서버와 연결할 수 없습니다.');
        this.setState({bankList: null});
      }
    );
  }



  
  // fetchCardData: get cardinfo data
  fetchCardData = (pagination, filters, sorter) => {
    this.setState({loading: true});

    // set searchString
    const { searchString } = this.state;
    let searchCardName = searchString;
    let searchCardNum = searchString;

    // if filters has input, then use searchString from filter
    // as searchString from state is not updated yet
    if (filters != null) {
      if (filters.cardName != null && filters.cardName[0] != null) {
        searchCardName = filters.cardName[0];
      } else {
        searchCardName = null;
      }
      if (filters.cardNum != null && filters.cardNum[0] != null) {
        searchCardNum = filters.cardNum[0];
      } else {
        searchCardNum = null;
      }
    }
    
    // POST request
    const reqOpt = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        header: {
          DATA_TYPE: 'J'
        },
        dto: {
          USER_ID: username,
          CARD_NM: searchCardName,
          CARD_NUM: searchCardNum,
          REQ_PAGESIZE: pagination.pageSize,
          REQ_PAGEIDX: pagination.current
        }
      })
    };

    // send request & get response
    let response = fetch(reqBaseUrl + 'ReadCardInfo?action=SO', reqOpt)
        .then(res => res.json());

    // response handling
    response.then(
      (responseJson) => {
        let newState = {loading: false};

        // received data successfully
        if ('dto' in responseJson && 'CardInfo' in responseJson.dto) {
          
          let mappedCardData = responseJson.dto.CardInfo.map((cardinfo, idx) => ({
            key: idx,
            cardName: cardinfo.CARD_NM,
            cardCompany: cardinfo.CARDCO_NM,
            cardNum: cardinfo.CARD_NUM,
            bankAccount: cardinfo.BANK_ACC,
            bank: cardinfo.BANK_NM,
            cardExpirationDate: cardinfo.CARD_EXPIRED,
            cardStatus: cardinfo.CARD_STATUS
          }));
          newState.cardData = mappedCardData;

          if (!(pagination.current > 0)) {
            newState.maxDataCount = responseJson.dto.CardInfo[0].REQ_PAGEIDX;
          }

        }
        
        // no data received
        else {
          if ('exception' in responseJson) { 
            message.error('서버와 연결할 수 없습니다.');
          } else {
            message.error('해당하는 카드가 존재하지 않습니다.');
          }
          newState.cardData = [];
        }
        this.setState(newState);
      },
      
      // connection fail
      () => {
        message.error('서버와 연결할 수 없습니다.');
        this.setState({cardData: null, loading: false});
      }
    );
  }


  
  //////////////////// add card info ////////////////////

  // showAddCardDiag: show modal
  showAddCardDiag = () => {
    this.setState({ isAddCardDiagVisible: true });
  };
  
  // hideAddCardDiag: hide modal
  hideAddCardDiag = () => {
    this.setState({ isAddCardDiagVisible: false });
  };

  // addCardInfo: send insert request
  addCardInfo = (cardinfo) => {
    const { pageSize } = this.state;
    
    this.setState({requestInProgress: true});
    
    var expirationDate = new Date(cardinfo.cardExpirationDate);
    // POST request
    const reqOpt = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        header: {
          DATA_TYPE: 'J'
        },
        dto: {
          USER_ID: username,
          CARD_NM: cardinfo.cardName,
          CARDCO_NM: cardinfo.cardCompany,
          CARD_NUM: cardinfo.cardNum,
          BANK_NM: cardinfo.bank,
          BANK_ACC: cardinfo.bankAccount,
          CARD_EXPIRED: [expirationDate.getFullYear(),
                         expirationDate.getMonth() + 1].join('-'),
          CARD_STATUS: cardinfo.cardStatus
        }
      })
    };

    // send request & set response data to state
    let response = fetch(reqBaseUrl + 'InsertCardInfo?action=SO', reqOpt)
        .then(res => res.json());

    // response handling
    response.then(
      (responseJson) => {
        if (!('exception' in responseJson)) {
          message.success('카드가 추가되었습니다.');
          this.setState({requestInProgress: false});
          setTimeout(() => {
            this.setState({isAddCardDiagVisible: false});
            this.fetchCardData({pageSize: pageSize, current: -1});
          }, 1000);
        } else {
          message.error('카드를 추가하는 도중 오류가 발생하였습니다.');
          this.setState({requestInProgress: false});
        }
      },
      () => {
        message.error('서버와 연결할 수 없습니다.');
        this.setState({requestInProgress: false});
      }
    );
  }


  //////////////////// mod card info ////////////////////

  // showModCardDiag: show modal
  showModCardDiag = () => {
    this.setState({ isModCardDiagVisible: true });
  };
  
  // hideModCardDiag: hide modal
  hideModCardDiag = () => {
    this.setState({ isModCardDiagVisible: false });
  };

  

  //////////////////// search data ////////////////////

  // onSearch: set search string before fetching data
  onSearch = (searchStringInput) => {
    const { pageSize } = this.state;
    
    this.setState({ searchString: searchStringInput });
    this.fetchCardData({pageSize: pageSize, current: -1},
                       {cardName: [searchStringInput], cardNum: [searchStringInput]});
  };
  

  
  //////////////////// initial fetch ////////////////////
  
  componentDidMount() {
    this.fetchCardData({pageSize: pageSizeDefault, current: -1});
    this.getCodeList();
  }


  //////////////////// render ////////////////////
  
  render() {
    
    const {
      loading, selectedRowKeys, cardData, maxDataCount,
      isAddCardDiagVisible, isModCardDiagVisible,
      requestInProgress,
      cardcoList, bankList,
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const pagination = {
      defaultPageSize: pageSizeDefault,
      total: maxDataCount,
      onChange: this.onPageChange
    }
    const itemSelected = selectedRowKeys.length > 0;
    const oneItemSelected = selectedRowKeys.length == 1;

    
    return (
        <div>
        <div style={{ marginTop: 10, marginBottom: 10, display: 'flex'}}>
        <Search placeholder="카드명 또는 카드번호" onSearch={this.onSearch} style={{ width: 200 }} />
        <Button style={{ float: 'left', margin: '0 2px'  }} onClick={this.showAddCardDiag} >
        추가
      </Button>

      
        <Modal title="카드 추가" visible={isAddCardDiagVisible}
      onCancel={this.hideAddCardDiag}
      okText='추가' cancelText='취소'
      destroyOnClose={true}
      footer={[
          <Button form="addCardForm" type="primary"
        key="submit" htmlType="submit" loading={requestInProgress}>
          카드 추가
        </Button>
        ]}
        >
        <Form id="addCardForm" onFinish={this.addCardInfo}
      initialValues={{cardStatus: '사용'}}
      {...modanFormLayout} >
        <Form.Item name='cardName' label='카드명'
        rules={[
          {
            required: true,
            message: '필수 입력 항목입니다.',
          },
        ]}>
        <Input/>
        </Form.Item>
        <Form.Item name='cardCompany' label='카드사'
        rules={[
          {
            required: true,
            message: '필수 선택 항목입니다.',
          },
        ]}>
        <Select placeholder='카드사 선택' onChange={this.onCardcoSelectClick}>
        {cardcoList}
        </Select>
        </Form.Item>
        <Form.Item name='cardNum' label='카드번호'
        rules={[
          {
            required: true,
            message: '필수 입력 항목입니다.',
          },
        ]}>
        <Input placeholder="'-' 없이 숫자만 입력" />
        </Form.Item>
        <Form.Item name='bank' label='결제계좌은행명'
        rules={[
          {
            required: true,
            message: '필수 선택 항목입니다.',
          },
        ]}>
        <Select placeholder='은행 선택' onChange={this.onBankSelectClick}>
        {bankList}
        </Select>
        </Form.Item>
        <Form.Item name='bankAccount' label='결제계좌번호'
        rules={[
          {
            required: true,
            message: '필수 입력 항목입니다.',
          },
        ]}>
        <Input placeholder="'-' 없이 숫자만 입력" />
        </Form.Item>
        <Form.Item name='cardExpirationDate' label='유효기간'
        rules={[
          {
            required: true,
            message: '필수 선택 항목입니다.',
          },
        ]}>
        <DatePicker picker='month' placeholder='유효기간 선택'/>
        </Form.Item>
        <Form.Item name='cardStatus' label='상태'
        rules={[
          {
            required: true,
            message: '필수 선택 항목입니다.',
          },
        ]}>
        <Radio.Group value='cardStatus'>
        <Radio.Button value='사용'>사용</Radio.Button>
        <Radio.Button value='사용중지'>사용중지</Radio.Button>
        </Radio.Group>
        </Form.Item>
        </Form>
        </Modal>


      
        <Button style={{ float: 'left', margin: '0 2px'  }} onClick={this.showModCardDiag} disabled={!oneItemSelected} >
        수정
      </Button>
        <Modal title="카드 정보 수정" visible={isModCardDiagVisible} onOk={this.okModCardDiag} onCancel={this.cancelModCardDiag}>
        <Form preserve={false} />
        </Modal>
        <Button danger style={{ float: 'left', margin: '0 2px'  }} onClick={this.start} disabled={!itemSelected} >
        삭제
      </Button>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={cardData} onChange={this.fetchCardData} pagination={pagination} loading={loading} />
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
        <Menu theme="dark" defaultSelectedKeys={['2']} mode="inline">
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
        <CardTable/>
        </Content>
        </Layout>
        </Layout>
    );
  }
}

function Card() {
  return (
      <SiderDemo />
  );
}

export default Card;

