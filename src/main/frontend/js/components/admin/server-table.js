import React from "react";
import * as PropTypes from 'prop-types';
import { FormattedTime } from 'react-intl';
import _ from 'lodash';
import SimpleAppBar from './admin-user-toolbar';
import Paper from '@material-ui/core/Paper';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';


export class AdminTable extends React.Component {


  render() {
    var data = this.props.servers;
    return (
      <Paper>

        <div>

          <Table >
            <TableHead>
              <TableRow  >
                <TableCell width="66px" padding='checkbox'>  </TableCell>
                <TableCell > Name </TableCell>
                <TableCell > Description </TableCell>
                <TableCell > URL </TableCell>
                <TableCell > Available </TableCell>
                <TableCell > Last Modified </TableCell>
                <TableCell > Role </TableCell>
              </TableRow>
            </TableHead>
            <TableBody >
              {(_.isEmpty(data)) ?
                <TableRow key={0}>
                  <TableCell style={{ textAlign: 'center' }}>No available server</TableCell>
                </TableRow>
                : (data.map((row, index) => (
                  <TableRow key={row.id} >
                    <TableCell component="th" scope="row" width="66px" padding='checkbox'>{
                      <i className="fa fa-server" />
                    }
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.url}</TableCell>
                    <TableCell width="80px" >{row.available ? <i className="fa fa-check"></i> : <i className="fa fa-times"></i>}</TableCell>
                    <TableCell>
                      <FormattedTime value={row.started_at} day='numeric' month='numeric' year='numeric' />
                    </TableCell>
                    <TableCell>{row.role_eligible}</TableCell>
                  </TableRow>
                )))}

            </TableBody>
            <TableFooter>
              <TableRow />
            </TableFooter>
          </Table>
        </div>
      </Paper>

    );
  }
}
AdminTable.propTypes = {
  servers: PropTypes.array,
};

