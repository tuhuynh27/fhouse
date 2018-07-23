import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import Error from './Error';
import { toTitleCase } from '../../common/util';

import { connect } from 'react-redux';

class RecipeListing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    // Prop
    const { error, loading, recipes } = this.props;

    // If not logged in
    if (!this.props.member.isAdmin) {
      return (
        <Error title={'Permission Denied'} content={'Only admin can view this page, please login as Admin and try again.'} />
      );
    }

    // Keys
    let keys = Object.keys(recipes).reverse();

    keys = keys.filter((key) => {
      return recipes[key].isApproved !== 1 && recipes[key].isApproved !== 2;
    });

    // Error
    if (error) return <Error content={error} />;

    // Build Cards for Listing
    const cards = keys.map(item => (
      <Card key={item}>
        <Link to={`/recipe/${item}`}>
          <CardImg top src={recipes[item].images[0]} />
        </Link>
        <CardBody>
          <CardTitle>{toTitleCase(recipes[item].address)}</CardTitle>
          <CardText>{toTitleCase(recipes[item].district)} District</CardText>
          <Link className="btn btn-primary" to={`/recipe/${item}`}>View Room <i className="icon-arrow-right" /></Link>
        </CardBody>
      </Card>
    ));

    // Show Listing
    return (
      <div>
        <Row>
          <Col sm="12">
            <h1>Rooms</h1>
            <p>Show all rooms in database.</p>
          </Col>
        </Row>
        <Row className={loading ? 'content-loading' : ''}>
          <Col sm="12" className="card-columns">
            {cards}
          </Col>
        </Row>
      </div>
    );
  };
}

RecipeListing.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  recipes: PropTypes.object.isRequired,
};

RecipeListing.defaultProps = {
  error: null,
};

const mapStateToProps = state => ({
  member: state.member || {},
});

const mapDispatchToProps = {
  //
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipeListing);
