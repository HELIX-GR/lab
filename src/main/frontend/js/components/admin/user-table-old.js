import React from "react";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { grand_role, revoke_role } from '../../ducks/admin';
import { FormattedTime } from 'react-intl';
import _ from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import SimpleAppBar from './admin-user-toolbar';
import { withStyles } from '@material-ui/core/styles';

const all_roles = ["ROLE_STUDENT", "ROLE_ACADEMIC", "ROLE_TESTER", "ROLE_ADMIN"];
const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    //overflowX: 'auto',
  },
});

export class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: {
        ROLE_USER: true,
        ROLE_ADMIN: false,
      },
      page: 0,
      rowsPerPage: 5,
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
        <TableCell padding='none'>
          <Checkbox
            checked={row.roles.includes(r)}
            onChange={(e, is) => { this.updateCheck(is, r, row.id); }}
          />
        </TableCell>)
      )
    );
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };



  render() {
    var data = this.props.users;
    const {rowsPerPage, page} = this.state;
    const { classes } = this.props;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
<Paper className={classes.root}>
        
        <div className={classes.tableResponsive}>
        <Table className={classes.body}>
          <TableHead >
            <TableRow >
              <TableCell padding='checkbox'>ID</TableCell>
              <TableCell >Username</TableCell>
              <TableCell >Full Name</TableCell>
              <TableCell >email</TableCell>
              <TableCell >Registered At</TableCell>
              <TableCell padding='checkbox' >Student</TableCell>
              <TableCell padding='checkbox' >Academic</TableCell>
              <TableCell padding='checkbox' >Tester</TableCell>
              <TableCell padding='checkbox' >Admin</TableCell>
            </TableRow>
          </TableHead>

          <TableBody >
            {(_.isEmpty(data)) ?
              <TableRow key={0}>
                <TableCell style={{ textAlign: 'center' }}>No available Users</TableCell>
              </TableRow>
              : (data.map((row, key) => (
                <TableRow key={row.id} 
                hover
                //onClick={event => this.handleRowClick(event, index, row.type, row.name)}
                >
                  <TableCell  padding='checkbox' >{row.id}</TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.fullName}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    <FormattedTime value={row.registeredAt} day='numeric' month='numeric' year='numeric' />
                  </TableCell>
                  {this.RoleCheckboxes(row)}
                </TableRow>
              )))}

          </TableBody>
          <TableFooter  >
            <TableRow />
          </TableFooter>
        </Table>
        </div>
      </Paper>
    );

  }
}
UserTable.propTypes = {
  classes: PropTypes.object.isRequired,
};



function mapStateToProps(state) {
  return {

  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ grand_role, revoke_role }, dispatch);



export default UserTable = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UserTable));
