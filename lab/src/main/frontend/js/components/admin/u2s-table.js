import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedTime } from 'react-intl';
import _ from 'lodash';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
  TableFooter,
} from '@material-ui/core/Table';

import Checkbox from '@material-ui/core/Checkbox';
import SimpleAppBar from './admin-user-toolbar';

const all_roles = ["ROLE_STUDENT", "ROLE_ACADEMIC", "ROLE_TESTER", "ROLE_ADMIN"];

export class U2sTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: {
        ROLE_USER: true,
        ROLE_ADMIN: false,
      },

    };

    this.updateCheck = this.updateCheck.bind(this);
    this.RoleCheckboxes = this.RoleCheckboxes.bind(this);

  }
  updateCheck(is, r, user_id,index) {
    if (is) {
      this.props.grand_role(user_id, r);
    } else {
      this.props.revoke_role(user_id, r);
    }

  }

  RoleCheckboxes = (row) => {
    return (
      all_roles.map((r, index) => (
        <TableRowColumn width="66px">
          <Checkbox
            checked={row.roles.includes(r)}
            onCheck={(e, is) => { this.updateCheck(is, r, row.id); }}
          />
        </TableRowColumn>)
      )
    );
  }

  render() {
    var data = this.props.u2s;
    return (
      <div>
        <SimpleAppBar />
        <Table height={"400px"}
        >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false} >
            <TableRow >
              <TableHeaderColumn width="66px" tooltip="ID">ID</TableHeaderColumn>
              <TableHeaderColumn tooltip="Username">Username</TableHeaderColumn>
              <TableHeaderColumn tooltip="Full Name">Full Name</TableHeaderColumn>
              <TableHeaderColumn tooltip="url">email</TableHeaderColumn>
              <TableHeaderColumn tooltip="Last Modified">Registered At</TableHeaderColumn>
              <TableHeaderColumn width="66px" tooltip="Student"> Student  </TableHeaderColumn>
              <TableHeaderColumn width="66px" tooltip="Academic">  Academic </TableHeaderColumn>
              <TableHeaderColumn width="66px" tooltip="Tester">Tester</TableHeaderColumn>
              <TableHeaderColumn width="66px" tooltip="Admin"> Admin  </TableHeaderColumn>
            </TableRow>
          </TableHeader>

          <TableBody displayRowCheckbox={false} >
            {(_.isEmpty(data)) ?
              <TableRow>
                <TableRowColumn style={{ textAlign: 'center' }}>No open Notebooks</TableRowColumn>
              </TableRow>
              : (data.map((row, index) => (
                <TableRow key={row.id} rowNumber={row.id}>
                  <TableRowColumn width="66px" >{row.id}</TableRowColumn>
                  <TableRowColumn>{row.username}</TableRowColumn>
                  <TableRowColumn>{row.fullName}</TableRowColumn>
                  <TableRowColumn>{row.email}</TableRowColumn>
                  <TableRowColumn>
                    <FormattedTime value={row.registeredAt} day='numeric' month='numeric' year='numeric' />
                  </TableRowColumn>
                  {this.RoleCheckboxes(row)}
                </TableRow>
              )))}

          </TableBody>
          <TableFooter adjustForCheckbox={false} >
            <TableRow />
          </TableFooter>
        </Table>
      </div>
    );

  }
}




function mapStateToProps(state) {
  return {

  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({  }, dispatch);



export default U2sTable = connect(mapStateToProps, mapDispatchToProps)(U2sTable);
