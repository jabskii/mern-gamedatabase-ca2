import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export default class NavBar extends Component {
  logout = () => {
    localStorage.removeItem('jwtToken');
    this.props.onLogout();
    window.location = '/';
  };

  render() {
    //Passing props from one component to another
    const loggedIn = this.props.loggedIn;
    return (
      <Navbar
        sticky="top"
        // collapseOnSelect
        expand="lg"
        bg="light"
        variant="light"
      >
        <Navbar.Brand to="/">GameDB</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/">
              Games
            </Nav.Link>
            {/* <Nav.Link as={Link} to="/genres">
              Top Games
            </Nav.Link> */}
          </Nav>
          <Nav>
            {loggedIn ? (
              <Nav.Link onClick={this.logout}>Logout</Nav.Link>
            ) : (
              <>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
