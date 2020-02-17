import React, { Component } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default class GameModeEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ''
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;

    axios.defaults.headers.common['Authorization'] = localStorage.getItem(
      'jwtToken'
    );

    axios.get(`http://localhost:5000/game_modes/${id}`).then(result => {
      console.log(result);
      this.setState({
        name: result.data.name
      });
    });
  }

  handleInputChange = e => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  onSubmit = e => {
    e.preventDefault();
    const { id } = this.props.match.params;

    const game_mode = {
      name: this.state.name
    };

    console.log(game_mode);
    axios.defaults.headers.common['Authorization'] = localStorage.getItem(
      'jwtToken'
    );

    axios
      .put(`http://localhost:5000/game_modes/${id}`, game_mode)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
        window.location = `/game_modes/update/${id}`;
      });
    window.location = '/game_modes';
  };

  render() {
    return (
      <div>
        <h3>Add new Game Mode</h3>
        <Form onSubmit={this.onSubmit} encType="multipart/form-data">
          <Form.Group as={Row} controlId="formHorizontalName">
            <Form.Label column sm={2}>
              Name
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                required
                type="text"
                placeholder="Name"
                name="name"
                value={this.state.name}
                onChange={this.handleInputChange}
              />
            </Col>
          </Form.Group>

          <br />
          <Form.Group as={Row}>
            <Col sm={{ span: 10, offset: 2 }}>
              <Button type="submit">Add Game Mode</Button>
            </Col>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
