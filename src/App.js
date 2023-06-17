import Navigationbar from './Components/Layout/Navigationbar';
import Login from './Components/Pages/Login';
import './App.css'
import { Redirect, Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Inbox from './Components/Pages/Inbox';
import ComposeMail from './Components/Pages/ComoseMail';
import Sent from './Components/Pages/Sent';
import Footer from './Components/Layout/Footer';




function App() {
  const token = useSelector(state => state.authentication.token)
  return (
    <>
      {token && <Navigationbar />}
      <div>
        <Switch>
          <Route exact path='/'>
            <Login />
          </Route>
          <Route exact path='/composemail'>
            {token && <ComposeMail />}
            {!token && <Redirect to='/' />}
          </Route>
          <Route exact path='/sent'>
            {token && <Sent />}
            {!token && <Redirect to='/' />}
          </Route>
          <Route exact path='/inbox'>
            {token && <Inbox />}
            {!token && <Redirect to='/' />}
          </Route>
        </Switch>
        {token && <Footer />}
      </div>
    </>
  );
}

export default App;