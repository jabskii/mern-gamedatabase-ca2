import React, { Component } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default class GenreCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ''
    };
  }

  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem(
      'jwtToken'
    );
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

    const genre = {
      name: this.state.name
    };

    console.log(genre);
    
    axios.defaults.headers.common['Authorization'] = localStorage.getItem(
      'jwtToken'
    );

    axios
      .post('http://localhost:5000/genres', genre)
      .then(res => {
        console.log(res.data);
        window.location = "/genres";
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        <h3>Add new Genre</h3>
        <Form onSubmit={ this.onSubmit } encType="multipart/form-data">
          <Form.Group as={ Row } controlId="formHorizontalName">
            <Form.Label column sm={ 2 }>
              Name
            </Form.Label>
            <Col sm={ 10 }>
              <Form.Control
                required
                type="text"
                placeholder="Name"
                name="name"
                value={ this.state.name }
                onChange={ this.handleInputChange }
              />
            </Col>
          </Form.Group>

          <br />
          <Form.Group as={ Row }>
            <Col sm={ { span: 10, offset: 2 } }>
              <Button type="submit">Add Genre</Button>
            </Col>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
