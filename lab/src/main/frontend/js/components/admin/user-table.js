import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { grand_role, revoke_role } from '../../ducks/admin';
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
      this.props.grand_role(user_id, r);
    } else {
      this.props.revoke_role(user_id, r);
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
        Header: 'email',
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
      },
      {
        Header: (
          all_roles.map(name =>
              <a>
                <img className="account-icon" src={"/images/" + name + ".svg"} height="42" width="42"/>
              </a>
          )),
        accessor: 'roles',
        Cell: props => (all_roles.map((role) => {
          return (<Checkbox
            checked={props.value.includes(role)}
            onChange={(e, is) => { this.updateCheck(is, role, props.row.id ); }}
          />);
        }
        )),
        width: 300,
      },
    ];



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


const mapDispatchToProps = (dispatch) => bindActionCreators({ grand_role, revoke_role }, dispatch);



export default UserTable = connect(mapStateToProps, mapDispatchToProps)(UserTable);
