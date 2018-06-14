import React from "react";
import * as PropTypes from 'prop-types';
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
} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';


export class AdminTable extends React.Component {
  render() {
    var data = this.props.servers;
    return (
      <Table height={"400px"}
      >
        <TableHeader
          displaySelectAll={false}
          displayRowCheckbox={false} >
          <TableRow  >
            <TableHeaderColumn width="66px" tooltip="The ID">  </TableHeaderColumn>
            <TableHeaderColumn tooltip="Name">Name</TableHeaderColumn>
            <TableHeaderColumn tooltip="description">description</TableHeaderColumn>
            <TableHeaderColumn tooltip="url">URL</TableHeaderColumn>
            <TableHeaderColumn width="80px" tooltip="available">available</TableHeaderColumn>
            <TableHeaderColumn tooltip="Last Modified">started_at</TableHeaderColumn>
            <TableHeaderColumn tooltip="Last Modified">role</TableHeaderColumn>
          </TableRow>
        </TableHeader>

        <TableBody displayRowCheckbox={false} >
          {(_.isEmpty(data)) ?
            <TableRow>
              <TableRowColumn style={{ textAlign: 'center' }}>No available server</TableRowColumn>
            </TableRow>
            : (data.map((row, index) => (
              <TableRow key={index}>
                <TableRowColumn width="66px" >{
                  <i className="fa fa-server" />
                }
                </TableRowColumn>
                <TableRowColumn>{row.name}</TableRowColumn>
                <TableRowColumn>{row.description}</TableRowColumn>
                <TableRowColumn>{row.url}</TableRowColumn>
                <TableRowColumn width="80px" >{row.available ? <i className="fa fa-check"></i> : <i className="fa fa-times"></i>}</TableRowColumn>
                <TableRowColumn>
                  <FormattedTime value={row.started_at} day='numeric' month='numeric' year='numeric' />
                </TableRowColumn>
                <TableRowColumn>{row.role_eligible}</TableRowColumn>
              </TableRow>
            )))}

        </TableBody>
        <TableFooter adjustForCheckbox={false} >
          <TableRow />
        </TableFooter>
      </Table>
    );
  }
}
AdminTable.propTypes = {
  servers: PropTypes.array,
};