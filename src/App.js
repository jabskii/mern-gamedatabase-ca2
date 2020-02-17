import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import GameIndex from './views/games/Index';
import GameShow from './views/games/Show';
import GameCreate from './views/games/Create';
import GameEdit from './views/games/Edit';

import NavBar from './components/NavBar';
import Register from './views/users/Register';
import Login from './views/users/Login';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: localStorage.getItem('jwtToken') !== null
    };
  }

  //Handeling the login, setting state and props
  authHandler = () => {
    this.setState((state, props) => ({
      loggedIn: state.loggedIn ? false : true
    }));
  };

  render() {
    const loggedIn = this.state.loggedIn;
    return (
      <BrowserRouter>
        <NavBar loggedIn={loggedIn} onLogout={this.authHandler} />
        <Container>
          <Row>
            <Col>
              {/* switching in and out components  */}
              <Switch>
                {/* Game Routes connected to Compnents */}
                <Route path="/" exact component={GameIndex} />
                <Route exact path="/games/create">
                  {loggedIn ? <GameCreate /> : <Redirect to="/" />}
                </Route>
                <Route path="/games/:id" exact component={GameShow} />
                <Route path="/games/update/:id" exact component={GameEdit} />

                {/* User Routes connected to components */}
                <Route path="/register" exact component={Register} />
                <Route
                  path="/login"
                  exact
                  component={props => (
                    //passing props down through components
                    <Login {...props} onLogin={this.authHandler} />
                  )}
                />
              </Switch>
            </Col>
          </Row>
        </Container>
      </BrowserRouter>
    );
  }
}

export default App;
