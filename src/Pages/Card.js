import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import 'antd/dist/antd.css';
import { Layout, Menu, Table, Button, Pagination } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const reqUrl = 'http://192.1.4.246:14000/AB3-5/OJT/';
const soName = 'ReadCardInfo';
const username = 'admin';
const pageSizeDefault = 20;

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
  };

  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    /*
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false
      });
    }, 1000);
    */
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };



  // fetch data from server
  fetchCardData = (pagination, filters, sorter) => {
    this.setState({loading: true});
    
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
          REQ_PAGESIZE: pagination.pageSize,
          REQ_PAGEIDX: pagination.current
        }
      })
    };

    // send request & set response data to state
    let response = fetch(reqUrl + soName + '?action=SO', reqOpt)
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
        }
        this.setState(newState);
      },
      () => {
        this.setState({loading: false});
        console.log('Failed to get response');
      }
    );
  }


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
    const hasSelected = selectedRowKeys.length > 0;
    return (
        <div>
        <div style={{ marginBottom: 16 }}>
        <Button type="primary" style={{ float: 'left', margin: '0 2px' }} onClick={this.start} disabled={!hasSelected} >
        검색
      </Button>
        <Button type="primary" style={{ float: 'left', margin: '0 2px'  }} onClick={this.start} disabled={!hasSelected} >
        추가
      </Button>
        <Button type="primary" style={{ float: 'left', margin: '0 2px'  }} onClick={this.start} disabled={!hasSelected} >
        수정
      </Button>
        <Button type="primary" style={{ float: 'left', margin: '0 2px'  }} onClick={this.start} disabled={!hasSelected} >
        삭제
      </Button>
        <span style={{ marginLeft: 8 }}>
        {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
      </span>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={cardData} onChange={this.fetchCardData} pagination={{defaultPageSize: pageSizeDefault, total: maxDataCount}} loading={loading} />
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

