import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import propTypes from "prop-types";

import {
  Card,
  ListGroup,
  ListGroupItem,
  CardColumns,
  Button,
  Col,
  Row,
  InputGroup,
  FormControl
} from "react-bootstrap";

//Functional component and handeling props
const Platform = props => (
  <Card>
    <Card.Body>
      <Card.Title><a href={ `platforms/${ props.platform._id }` }>{ props.platform.name }</a></Card.Title>
    </Card.Body>
  </Card>
);

export default class PlatformIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      platforms: [],

      search: ""
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:5000/platforms/")
      .then(response => {
        console.log(response);
        this.setState({
          platforms: response.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  handleInputChange = e => {
    const target = e.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  };

  render() {
    let filteredPlatforms = this.state.platforms.filter(platform => {
      return platform.name.toLowerCase().indexOf(this.state.search) !== -1;
    });

    return (
      <>
        <Row>
          <Col sm={ 12 }>
            <h3 className="mt-2">Platform List</h3>
            <InputGroup className="mt-2 mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">Search</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder="Search"
                name="search"
                aria-label="Search"
                aria-describedby="basic-addon1"
                value={ this.state.search }
                onChange={ this.handleSearchInput }
              />
            </InputGroup>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col>
            {localStorage.jwtToken != null ? (
              <Button className="float-right mb-4" as={ Link } to="/platforms/create">
                Add Platform
              </Button>
            ) : (
              <>
                <Button className="float-right mb-4" as={ Link } to="/login">
                  Login to Create
                </Button>
              </>
            )}
          </Col>
        </Row>

        <CardColumns>
          {/* mapping the functional components and looping through them */}
          {filteredPlatforms.map(a => {
            return <Platform platform={ a } key={ a._id } />;
          })}
        </CardColumns>
      </>
    );
  }
}
//Prop types insuring that only a string is being inputed
PlatformIndex.propTypes = {
  search: propTypes.string
};
