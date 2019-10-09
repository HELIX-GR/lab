import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { grantUserRole, revokeUserRole } from '../../ducks/admin';
import { FormattedTime } from 'react-intl';

import Checkbox from '@material-ui/core/Checkbox';
import ReactTable from "react-table";

import { Roles } from '../../model';

class UserTable extends React.Component {

  constructor(props) {
    super(props);

    this.updateCheck = this.updateCheck.bind(this);
  }

  updateCheck(is, r, user_id) {
    if (is) {
      this.props.grantUserRole(user_id, r);
    } else {
      this.props.revokeUserRole(user_id, r);
    }
  }

  render() {
    const data = this.props.users;

    const UserColumns = [{
      Header: 'id',
      accessor: 'id',
      show: false,
    }, {
      Header: 'Username',
      accessor: 'username',
      headerStyle: { textAlign: 'left' },
      style: { display: 'flex', alignItems: 'center' },
      Cell: props => (
        <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{props.value}</div>
      ),
      width: 220,
      show: false,
    }, {
      Header: 'Email',
      accessor: 'email',
      headerStyle: { textAlign: 'left' },
      style: { display: 'flex', alignItems: 'center' },
      Cell: props => (
        <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{props.value}</div>
      ),
      width: 220
    }, {
      Header: 'Full Name',
      headerStyle: { textAlign: 'left' },
      style: { display: 'flex', alignItems: 'center' },
      Cell: props => (
        <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {[props.original.givenName, props.original.familyName].join(' ')}
        </div>
      )
    }, {
      Header: 'Created',
      id: 'registeredAt',
      accessor: 'registeredAt',
      headerStyle: { textAlign: 'center' },
      style: { display: 'flex', alignItems: 'center' },
      Cell: props => (
        <FormattedTime value={props.value} day='numeric' month='numeric' year='numeric' />
      ),
      width: 150,
    },
    ...Roles.LAB.map(name => {
      return ({
        Header: <img className="account-icon" src={"/images/png/" + name + ".png"} height="35" width="35" />,
        id: name,
        accessor: 'roles',
        Cell: props => (<Checkbox
          checked={props.value.includes(name)}
          onChange={(e, is) => { this.updateCheck(is, name, props.row.id); }}
        />
        ),
        width: 60,
      });
    })];

    return (
      <div className="helix-table-container">
        <ReactTable
          data={data}
          columns={UserColumns}
          defaultPageSize={10}
          showPageSizeOptions={false}
          className="-striped -highlight"
        />
      </div >
    );

  }
}


const mapStateToProps = () => ({
});


const mapDispatchToProps = (dispatch) => bindActionCreators({
  grantUserRole,
  revokeUserRole
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserTable);
