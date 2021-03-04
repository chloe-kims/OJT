import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import 'antd/dist/antd.css';
import { Layout, Menu, Table, Button, Input, Pagination } from 'antd';
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

// config
const reqBaseUrl = 'http://192.1.4.246:14000/AB3-5/OJT/';
const username = 'admin';
const pageSizeDefault = 10;

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
    title: '결제계좌번호',
    dataIndex: 'bankAccount',
    width: '20%',
  },
  {
    title: '결제계좌은행명',
    dataIndex: 'bank',
    width: '13%',
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
    cardData: [],
    maxDataCount: -1,
    searchString: null,
  };

  start = () => {
    this.setState({ loading: true });
  };

  onSelectChange = selectedRowKeys => {
    //console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };



  // fetch data from server
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

    // send request & set response data to state
    let response = fetch(reqBaseUrl + 'ReadCardInfo?action=SO', reqOpt)
        .then(res => res.json());
    response.then(
      (responseJson) => {
        let newState = {loading: false};
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
          
        } else {
          console.log('Exception in response');
          newState.cardData = [];
        }
        this.setState(newState);
      },
      () => {
        this.setState({loading: false});
        console.log('Failed to get response');
      }
    );
  }

  /*
  onPageChange = (page, pageSize) => {
    console.log('onPageChange');
    console.log(page);
    console.log(pageSize);

    //this.setState({ pageSize: pageSize, pageIdx: page });
  }
  */
  
  onSearch = (searchStringInput) => {
    //console.log('onSearch', searchStringInput);
    this.setState({ searchString: searchStringInput });
    this.fetchCardData({pageSize: pageSizeDefault, current: -1},
                       {cardName: [searchStringInput], cardNum: [searchStringInput]});
  };


  // initial fetch
  componentDidMount() {
    this.fetchCardData({pageSize: pageSizeDefault, current: -1});
  }

  render() {
    const { loading, selectedRowKeys, cardData, maxDataCount } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const pagination = {
      defaultPageSize: pageSizeDefault,
      total: maxDataCount,
    }
    const hasSelected = selectedRowKeys.length > 0;
    return (
        <div>
        <div style={{ marginTop: 10, marginBottom: 10, display: 'flex'}}>
        <Search placeholder="카드명 또는 카드번호" onSearch={this.onSearch} style={{ width: 200 }} />
        <Button style={{ float: 'left', margin: '0 2px'  }} onClick={this.start} >
        추가
      </Button>
        <Button style={{ float: 'left', margin: '0 2px'  }} onClick={this.start} disabled={!hasSelected} >
        수정
      </Button>
        <Button danger style={{ float: 'left', margin: '0 2px'  }} onClick={this.start} disabled={!hasSelected} >
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

