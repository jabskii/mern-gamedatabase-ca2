import React, { Component } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default class PlatformEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      igdb_id: '',
      name: ''
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;

    axios.defaults.headers.common['Authorization'] = localStorage.getItem(
      'jwtToken'
    );

    axios.get(`http://localhost:5000/platforms/${ id }`).then(result => {
      console.log(result);
      this.setState({
        igdb_id: result.data.igdb_id,
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

    const platform = {
      igdb_id: this.state.igdb_id,
      name: this.state.name
    };

    console.log(platform);
    axios.defaults.headers.common['Authorization'] = localStorage.getItem(
      'jwtToken'
    );

    axios
      .put(`http://localhost:5000/platforms/${ id }`, platform)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
        window.location = `/platforms/update/${ id }`;
      });
    window.location = '/platforms';
  };

  render() {
    return (
      <div>
        <h3>Edit Platform</h3>
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
              <Button type="submit">Finish</Button>
            </Col>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
