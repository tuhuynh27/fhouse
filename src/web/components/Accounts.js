import React from 'react';
import { Table, Button, Row, Col } from 'reactstrap';
import moment from 'moment';

import { connect } from 'react-redux';

import { getListAccount, setAdmin, unsetAdmin } from '../../actions/member';

import Error from './Error';

class AccountListing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accounts: {}
    };
  }

  componentDidMount() {
    getListAccount(accounts => this.setState({ accounts }));
  }

  handleSetAdmin(id) {
    setAdmin(id);
  }

  hanldeUnsetAdmin(id) {
    if (id === "V4Ecz2MyawSWWDCKCt6TG4CjV4x2") {
      alert("Sorry, you cannot unset the master administrator.");
      return;
    }

    if (id === this.props.member.uid) {
      alert("Sorry, you cannoy unset yourself.");
      return;
    }

    unsetAdmin(id);
  }

  render() {
    // Props
    const { accounts } = this.state;
    const keys = Object.keys(accounts);

    // If not logged in
    if (!this.props.member.isAdmin) {
      return (
        <Error title={'Permission Denied'} content={'Only admin can view this page, please login as Admin and try again.'} />
      );
    }

    const renderListAccount = keys.map((key, index) => (
      <tr key={key}>
        <th scope="row">{index + 1}</th>
        <td>{accounts[key].email}</td>
        <td>{accounts[key].firstName + " " + accounts[key].lastName}</td>
        <td>{moment.unix(accounts[key].lastLoggedIn / 1000).toString()}</td>
        <td>{moment.unix(accounts[key].signedUp / 1000).toString()}</td>
        <td>
          {accounts[key].isAdmin && <Button color="secondary" onClick={() => this.hanldeUnsetAdmin(key)}>Unset</Button>}
          {!accounts[key].isAdmin && <Button color="primary" onClick={() => this.handleSetAdmin(key)}>Set Admin</Button>}
        </td>
      </tr>
    ));

    return (
      <div>
        <Row>
          <Col sm="12">
            <h1>Accounts</h1>
            <p>Show account to manage.</p>
          </Col>
        </Row>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Full Name</th>
              <th>Last Login</th>
              <th>Signup Time</th>
              <th>Admin?</th>
            </tr>
            {renderListAccount}
          </thead>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
});

const mapDispatchToProps = {
  //
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountListing);