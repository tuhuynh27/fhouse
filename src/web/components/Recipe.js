import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Card,
  CardText,
  CardBody,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Button,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import ErrorMessages from '../../constants/errors';
import Loading from './Loading';
import Error from './Error';

import { connect } from 'react-redux';

import { getUserDataByID } from '../../actions/member';
import { approveRoom } from '../../actions/recipes';

import { toTitleCase } from '../../common/util';

import moment from 'moment';

class RecipeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomMaster: 'Guest'
    };
  }

  componentDidMount() {
    // Set Room Master name - get from data
    getUserDataByID(this.props.recipes[this.props.recipeId].userID, (roomMaster) => {
      this.setState({
        roomMaster: roomMaster.lastName && roomMaster.lastName ? roomMaster.firstName + ' ' + roomMaster.lastName : 'Guest'
      });
    });
  }

  handleApproveRoom(id, code) {
    approveRoom(id, code);
  }

  render() {
    // Set props
    const {
      error,
      loading,
      recipes,
      recipeId
    } = this.props;

    // If not logged in
    if (!this.props.member.isAdmin) {
      return (
        <Error title={'Permission Denied'} content={'Only admin can view this page, please login as admin and try again.'} />
      );
    }

    // Loading
    if (loading) return <Loading />;

    // Error
    if (error) return <Error content={error} />;

    // Get this Recipe from all recipes
    const recipe = recipes[recipeId];

    // Recipe not found
    if (!recipe) return <Error content={ErrorMessages.recipe404} />;

    // Render images
    const renderImages = recipe.images.map(image => (
      <img key={image} src={image} style={{
        maxWidth: '500px',
        maxHeight: '300px',
        marginBottom: '20px',
        marginRight: '10px',
        display: 'inline-block'
      }} />
    ));

    // Build listing
    const utilities = recipe.utilities.map(item => (
      <ListGroupItem key={`${item}`}>{toTitleCase(item)}</ListGroupItem>
    ));

    const equipment = recipe.equipment.map(item => (
      <ListGroupItem key={`${item}`}>{toTitleCase(item)}</ListGroupItem>
    ));

    return (
      <div>
        <Row>
          <div style={{
            overflow: 'auto',
            whiteSpace: 'nowrap'
          }}>
            {renderImages}
          </div>
        </Row>
        <Row>
          <Col sm="12">
            <h1>{toTitleCase(recipe.address)}, {toTitleCase(recipe.district)}</h1>
            <p>by <strong>{this.state.roomMaster}</strong>, {moment().add(moment().unix() - recipe.time, 'seconds').fromNow()}</p>
            {(recipe.isApproved == 0 || !recipe.isApproved) && <p>This room is <strong>pending</strong>. Please <Button color="primary" size="sm" onClick={() => this.handleApproveRoom(recipeId, 1)}>Approve</Button> or <Button color="danger" size="sm" onClick={() => this.handleApproveRoom(recipeId, 2)}>Reject</Button> this room. </p>}
            {(recipe.isApproved == 1 || recipe.isApproved == 2) && <p>This room is <strong>{recipe.isApproved === 1 ? "approved" : "rejected" }</strong> by admin.</p>}
          </Col>
        </Row>
        <Row>
          <Col lg="4" className="recipe-view-card">
            <Card>
              <CardHeader>About this room</CardHeader>
              <CardBody>
                <CardText>
                  <div><strong>Current roomates</strong>: {recipe.roomates}</div>
                  <div><strong>Gender allow</strong>: {toTitleCase(recipe.gender)}</div>
                  <div><strong>Room square</strong>: {recipe.square}</div>
                  <div><strong>Phone number</strong>: {recipe.phoneNumber}</div>
                  <hr />
                  <div><strong>Description</strong>: </div>
                  <div>{recipe.description || "No description."}</div>
                </CardText>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4" className="recipe-view-card">
            <Card>
              <CardHeader>Utilities ({utilities.length})</CardHeader>
              <ListGroup className="list-group-flush">
                {utilities}
              </ListGroup>
            </Card>
          </Col>
          <Col lg="4" className="recipe-view-card">
            <Card>
              <CardHeader>Equipment ({equipment.length})</CardHeader>
              <ListGroup className="list-group-flush">
                {equipment}
              </ListGroup>
            </Card>
          </Col>
        </Row>
        <Row className="pb-3" style={{ marginTop: '20px' }}>
          <Col sm="12">
            <Link className="btn btn-secondary" to="/rooms"><i className="icon-arrow-left" /> Back</Link>
          </Col>
        </Row>
      </div >
    );
  };
}

RecipeView.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  recipeId: PropTypes.string.isRequired,
  recipes: PropTypes.object.isRequired,
};

RecipeView.defaultProps = {
  error: null,
};

const mapStateToProps = state => ({
  member: state.member || {},
});

const mapDispatchToProps = {
  //
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipeView);
