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


class ServerForm extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeAvailable = this.handleChangeAvailable.bind(this);
    this.handleChangeRole = this.handleChangeRole.bind(this);

    this.state = {
      name: "",
      url: "",
      description: "",
      admin_token: "",
      available: false,
      role_eligible: "ROLE_STANDARD"
    };
  }

  handleSubmit() {
    this.props.finish(this.state);
  }
  handleChange = (event) => this.setState({ [event.target.id]: event.target.value });
  handleChangeAvailable = (event, index, value) => this.setState({ available: event.target.value });
  handleChangeRole = (event, index, value) => this.setState({ role_eligible: event.target.value });

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} noValidate autoComplete="off">
        <TextField
          className={classes.textField}
          placeholder="Give a name to your server"
          label="Name"
          value={this.state.name}
          onChange={this.handleChange}
          id="name"
          fullWidth={true}
        /><br />
        <TextField
          className={classes.textField}
          placeholder="A valid url"
          label="URL"
          value={this.state.url}
          onChange={this.handleChange}
          id="url"
          fullWidth={true}
        /><br />
        <TextField
          className={classes.textField}
          placeholder="Description visible to user"
          label="Description"
          value={this.state.description}
          onChange={this.handleChange}
          multiLine={true}
          rows={2}
          id="description"
          fullWidth={true}
        /><br /> <TextField
          className={classes.textField}
          placeholder="Admin token"
          label="Admin token"
          value={this.state.admin_token}
          onChange={this.handleChange}
          id="admin_token"
          fullWidth={true}
        />
        <br />
        <div>
          <TextField
            select
            label="Make available"
            className={classes.textField}
            value={this.state.available}
            onChange={this.handleChangeAvailable}
            helperText="Do you want users to see this server now?"
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            margin="normal"
          >
            <MenuItem id="available" value={false}> No </MenuItem>
            <MenuItem id="available" value={true}> Yes </MenuItem>
          </TextField>
        </div>
        <div>

          <TextField
            select
            label="Role eligible"
            className={classes.textField}
            value={this.state.role_eligible}
            onChange={this.handleChangeRole}
            helperText="What role a user must have to see this server?"
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            margin="normal"

          >
            <MenuItem key={'ROLE_STANDARD'} value={'ROLE_STANDARD'}> Standard </MenuItem>
            <MenuItem key={'ROLE_BETA'} value={'ROLE_BETA'}> Beta Tester</MenuItem>
            {// <MenuItem value={'ROLE_TESTER'}> primaryText="EXPERIMENTAL</MenuItem>
              //<MenuItem value={'ROLE_OTHER'}> primaryText="OTHER</MenuItem>
            }
            <MenuItem key={'ROLE_ADMIN'} value={'ROLE_ADMIN'}> Admin</MenuItem>
          </TextField>
        </div>

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


      </form>
    );
  }
} ServerForm.propTypes = {
  finish: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ServerForm);
