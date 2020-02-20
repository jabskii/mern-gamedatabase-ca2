import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

import {
	Card,
	ListGroup,
	CardColumns,
	Button,
	Col,
	Row,
	InputGroup,
	FormControl
} from 'react-bootstrap';

const Publisher = props => (
	<Card style={{ width: '20rem' }}>
		<ListGroup variant='flush'>
			<ListGroup.Item>
				<a href={`publishers/${props.publisher._id}`}>{props.publisher.name}</a>
			</ListGroup.Item>
		</ListGroup>
	</Card>
);

export default class PublisherIndex extends Component {
	constructor(props) {
		super(props);

		this.state = {
			publishers: [],

			search: ''
		};
	}

	componentDidMount() {
		axios
			.get('http://localhost:5000/publishers/')
			.then(response => {
				console.log(response);
				this.setState({
					publishers: response.data
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
		let filteredPublishers = this.state.publishers.filter(publisher => {
			return publisher.name.toLowerCase().indexOf(this.state.search) !== -1;
		});

		return (
			<>
				<Row>
					<Col sm={12}>
						<h3 className='mt-2'>Publisher List</h3>
						<InputGroup className='mt-2 mb-3'>
							<InputGroup.Prepend>
								<InputGroup.Text id='basic-addon1'>Search</InputGroup.Text>
							</InputGroup.Prepend>
							<FormControl
								placeholder='Search'
								name='search'
								aria-label='Search'
								aria-describedby='basic-addon1'
								value={this.state.search}
								onChange={this.handleSearchInput}
							/>
						</InputGroup>
						<hr />
					</Col>
				</Row>
				<Row>
					<Col>
						{localStorage.jwtToken != null ? (
							<Button
								className='float-right mb-4'
								as={Link}
								to='/publishers/create'
							>
								Add Publishers
							</Button>
						) : (
							<>
								<Button className='float-right mb-4' as={Link} to='/login'>
									Login to Create
								</Button>
							</>
						)}
					</Col>
				</Row>

				<CardColumns>
					{filteredPublishers.map(p => {
						return <Publisher publisher={p} key={p._id} />;
					})}
				</CardColumns>
			</>
		);
	}
}

PublisherIndex.propTypes = {
	search: propTypes.string
};
