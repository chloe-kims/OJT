import './App.css';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './Pages/Login';
import Main from './Pages/Main';
import Sign from './Pages/Sign';
import Card from './Pages/Card';
import Payment from './Pages/Payment';
import UserinfoPw from './Pages/UserInfoPw';
import UserinfoChange from './Pages/UserInfoChange';
import File from './Pages/File';
import Deny from './Pages/Deny';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
const { Footer } = Layout;

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path='/' exact component={ Login } />
          <Route path='/main' component={ Main } />
          <Route path='/sign' component={ Sign } />
          <Route path='/card' component={ Card } />
          <Route path='/payment' component={ Payment } />
          <Route path='/userinfo/pw' component={ UserinfoPw } />
          <Route path='/userinfo/change' component={ UserinfoChange } />          
          <Route path='/file' component={ File } />          
          <Route path='/' component={ Deny } />
        </Switch>
      </Router>
      <Footer style={{ textAlign: 'center',  borderTop: '1px solid #e4e8eb', backgroundColor: '#fafbfc'}}>TmaxBI ©2021 Created by AB3-5</Footer>
    </div>
  );
}

export default App;

