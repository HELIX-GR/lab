import React from "react";
import * as PropTypes from 'prop-types';
import { FormattedTime } from 'react-intl';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
  TableFooter,
} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';


export class UserTable extends React.Component {
  render() {
    var data =this.props.users;
    return (
      <Table height={"400px"}
      >
        <TableHeader
          displaySelectAll={false}
          displayRowCheckbox={false} >
          <TableRow  >
          <TableHeaderColumn width="66px" tooltip="Active">   </TableHeaderColumn>
            <TableHeaderColumn width="66px" tooltip="The ID"> ID  </TableHeaderColumn>
            <TableHeaderColumn tooltip="Username">Username</TableHeaderColumn>
            <TableHeaderColumn tooltip="description">Full Name</TableHeaderColumn>
            <TableHeaderColumn tooltip="url">email</TableHeaderColumn>
            <TableHeaderColumn tooltip="Last Modified">Registered At</TableHeaderColumn>
            <TableHeaderColumn tooltip="Last Modified">Roles</TableHeaderColumn>
          </TableRow>
        </TableHeader>

        <TableBody displayRowCheckbox={false} >
          {(_.isEmpty(data)) ?
            <TableRow>
              <TableRowColumn style={{ textAlign: 'center' }}>No available Users</TableRowColumn>
            </TableRow>
            : (data.map((row, index) => (
              <TableRow key={index}>
                <TableRowColumn width="66px" >
                {row.active?<i className="fas fa-circle" style={{color:'#32CD32'}}></i>:<i className="fas fa-circle" style={{color:'red'}}> ></i>}
                </TableRowColumn>
                <TableRowColumn width="66px" >{row.id}</TableRowColumn>
                <TableRowColumn>{row.username}</TableRowColumn>
                <TableRowColumn>{row.fullName}</TableRowColumn>
                <TableRowColumn>{row.email}</TableRowColumn>
                <TableRowColumn>
                  <FormattedTime value={row.registeredAt} day='numeric' month='numeric' year='numeric' />
                </TableRowColumn>
                <TableRowColumn>{row.roles.map((r) => (r+', '))}</TableRowColumn>
              </TableRow>
            )))}
          
        </TableBody>
        <TableFooter adjustForCheckbox={false} >
          <TableRow />
        </TableFooter>
      </Table>
    )

  }
}
UserTable.propTypes = {
  servers: PropTypes.array,
};