import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 550,
  },
  menu: {
    width: 200,
  },
});

const styles2 = {
  customWidth: {
    width: 150,
  },
};


class WhiteListForm extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeRole = this.handleChangeRole.bind(this);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      roles: ["ROLE_STANDARD"],
    };
  }

  handleSubmit() {
    this.props.finish(this.state);
  }
  handleChange = (event) => this.setState({ [event.target.id]: event.target.value });
  handleChangeRole = (event, index, value) => this.setState({ roles: [event.target.value] });

  render() {
    const { classes } = this.props;

    return (
      <div>
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            className={classes.textField}
            placeholder="First Name"
            label="First Name"
            value={this.state.firstName}
            onChange={this.handleChange}
            id="firstName"
            fullWidth={true}
          /><br />
          <TextField
            className={classes.textField}
            placeholder="Last Name"
            label="Last Name"
            value={this.state.lastName}
            onChange={this.handleChange}
            id="lastName"
            fullWidth={true}
          /><br />
          <TextField
            className={classes.textField}
            placeholder="Email"
            label="Email"
            value={this.state.email}
            onChange={this.handleChange}
            id="email"
            fullWidth={true}
          />
          <br />
          <TextField
            className={classes.textField}
            select
            label="Role eligible"
            value={this.state.roles[0]}
            onChange={this.handleChangeRole}
            helperText="What role to give this User?"
          >
            <MenuItem key={'ROLE_STANDARD'} value={'ROLE_STANDARD'}> Standard </MenuItem>
            <MenuItem key={'ROLE_STANDARD_STUDENT'} value={'ROLE_STANDARD_STUDENT'}> Standard Student</MenuItem>
            <MenuItem key={'ROLE_STANDARD_ACADEMIC'} value={'ROLE_STANDARD_ACADEMIC'}> Standard Academic</MenuItem>
            <MenuItem key={'ROLE_BETA'} value={'ROLE_BETA'}> Beta Tester</MenuItem>
            <MenuItem key={'ROLE_BETA_STUDENT'} value={'ROLE_BETA_STUDENT'}> Beta Tester Student</MenuItem>
            <MenuItem key={'ROLE_BETA_ACADEMIC'} value={'ROLE_BETA_ACADEMIC'}> Beta Tester Academic </MenuItem>

          </TextField>
        </form>
        <br />
        <br />

        <Button
          variant="outlined"
          onClick={this.props.onClose}>
          Cancel
          </Button>
        <Button
          variant="outlined"
          label="Submit"
          onClick={this.handleSubmit}
        >Submit          </Button>
      </div>

    );
  }
} WhiteListForm.propTypes = {
  finish: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WhiteListForm);
