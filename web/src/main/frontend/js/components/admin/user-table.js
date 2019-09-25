import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { grantRole, revokeRole } from '../../ducks/admin';
import { FormattedTime } from 'react-intl';

import Checkbox from '@material-ui/core/Checkbox';
import ReactTable from "react-table";


const all_roles = ["ROLE_STANDARD", "ROLE_STANDARD_STUDENT", "ROLE_STANDARD_ACADEMIC", "ROLE_BETA", "ROLE_BETA_STUDENT", "ROLE_BETA_ACADEMIC"];



export class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: {
        ROLE_USER: true,
        ROLE_ADMIN: false,
      },
      page: 0,
      rowsPerPage: 15,
    };

    this.updateCheck = this.updateCheck.bind(this);

  }


  updateCheck(is, r, user_id) {
    if (is) {
      this.props.grantRole(user_id, r);
    } else {
      this.props.revokeRole(user_id, r);
    }

  }


  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };


  render() {
    const UserColumns = [
      {
        Header: 'ID',
        accessor: 'id',
        maxWidth: 33,
        show: false,
      },
      {
        Header: 'Username',
        accessor: 'username',
      },
      {
        Header: 'Full Name',
        accessor: 'fullName',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Created',
        id: 'registeredAt',
        accessor: 'registeredAt',
        Cell: props => (
          <FormattedTime value={props.value} day='numeric' month='numeric' year='numeric' />
        ),
        width: 150,
      }].concat(
        all_roles.map(name => {
          return ({
            Header: <img className="account-icon" src={"/images/png/" + name + ".png"} height="35" width="35" />,
            id: name,
            accessor: 'roles',
            Cell: props => (<Checkbox
              checked={props.value.includes(name)}
              onChange={(e, is) => { console.log(props); this.updateCheck(is, name, props.row.id); }}
            />
            ),
            width: 60,
          });
        }));



    var data = this.props.users;
    const { rowsPerPage, page } = this.state;
    //const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <div className="helix-table-container">
        <ReactTable
          data={data}
          columns={UserColumns}
          defaultPageSize={rowsPerPage}
          className="-striped -highlight"
        />
      </div >
    );

  }
}


function mapStateToProps(state) {
  return {

  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ grantRole, revokeRole }, dispatch);



export default UserTable = connect(mapStateToProps, mapDispatchToProps)(UserTable);
