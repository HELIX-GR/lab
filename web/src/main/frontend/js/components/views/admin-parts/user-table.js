import React from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedTime } from 'react-intl';

import Checkbox from '@material-ui/core/Checkbox';
import ReactTable from "react-table";

import { RoleGroups } from '../../../model';

import {
  grantUserRole,
  revokeUserRole,
} from '../../../ducks/admin';

import { default as ModalAddUser } from "./modal-edit-user";

class UserTable extends React.Component {

  onRoleChange(selected, roleName, userId) {
    if (selected) {
      this.props.grantUserRole(userId, roleName);
    } else {
      this.props.revokeUserRole(userId, roleName);
    }
  }

  render() {
    const { kernels, users: data } = this.props;

    const UserColumns = [{
      Header: 'id',
      accessor: 'id',
      show: false,
    }, {
      Header: '',
      maxWidth: 33,
      style: { display: 'flex', alignItems: 'center', textAlign: 'center', cursor: 'pointer' },
      Cell: props => (
        <ModalAddUser user={this.props.users.find(s => s.id == props.original.id)} />
      ),
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
      show: false,
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
      style: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
      Cell: props => (
        <FormattedTime value={props.value} day='numeric' month='numeric' year='numeric' />
      ),
      width: 150,
    }, {
      Header: 'Assigned Kernels',
      headerStyle: { textAlign: 'left' },
      accessor: 'kernels',
      style: { display: 'flex', alignItems: 'center', flexWrap: 'wrap' },
      Cell: props => (
        <React.Fragment>
          {props.original.kernels.map(name => {
            const kernel = kernels.find(k => k.name === name);
            return (
              <a key={kernel.name} className="tag-box tag-box-other">
                {kernel.tag}
              </a>
            );
          })}
        </React.Fragment>
      )
    },
    ...RoleGroups.LAB.map(name => {
      return ({
        Header: <img className="account-icon" src={"/images/png/" + name + ".png"} height="35" width="35" />,
        id: name,
        accessor: 'roles',
        Cell: props => (<Checkbox
          checked={props.value.includes(name)}
          onChange={(e, checked) => { this.onRoleChange(checked, name, props.row.id); }}
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

const mapStateToProps = (state) => ({
  kernels: state.config.kernels,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  grantUserRole,
  revokeUserRole
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserTable);
