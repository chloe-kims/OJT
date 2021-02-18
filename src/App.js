import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Pages/Login';
import Main from './Pages/Main';
import Sign from './Pages/Sign';
import Card from './Pages/Card';
import Payment from './Pages/Payment';
import Userinfo from './Pages/Userinfo';
import File from './Pages/File';
import Deny from './Pages/Deny';

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
          <Route path='/userinfo/pw' component={ Userinfo } />
          <Route path='/userinfo/change' component={ Userinfo } />          
          <Route path='/file' component={ File } />          
          <Route path='/' component={ Deny } />
        </Switch>
      </Router>
    </div>
  );
}

export default App;

