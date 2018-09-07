import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';


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

  handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value });
    this.props.change(this.state);
  }

  handleChangeAvailable = (event, index, value) => {
    console.log(event);
    this.setState({ available: event.target.value });
    this.props.change(this.state);
  }

  handleChangeRole = (value) => {
    console.log(value);
    this.setState({ role_eligible: value});
    this.props.change(this.state);
  }

  render() {
    const { classes } = this.props;

    return (
      <Form onClose={this.props.handleClose}>
        <FormGroup >
          <Label for="name">Name</Label>
          <Input type="text" name="name" id="name" value={this.state.name} placeholder="Give a name to your server" onChange={this.handleChange} />
        </FormGroup>
        <FormGroup>
          <Label for="url">URL</Label>
          <Input type="url" name="url" id="url" placeholder="A valid url" onChange={this.handleChange} />
        </FormGroup>
        <FormGroup>
          <Label for="admin_token">Admin token</Label>
          <Input type="text" name="admin_token" id="admin_token" placeholder="A valid admin token for the server" onChange={this.handleChange} />
        </FormGroup>
        <FormGroup>
          <Label for="description">Description</Label>
          <Input type="textarea" name="description" id="description" placeholder="Description visible to user." onChange={this.handleChange} />
        </FormGroup>
        <FormGroup>
          <Label for="role_eligible">Select role eligible</Label>
          <Input type="select" name="role_eligible" id="role_eligible" placeholder="What role a user must have to see this server?" onChange={(e) => this.handleChangeRole(`${e.target.value}`)}>
            <option key={'ROLE_STANDARD'} value={'ROLE_STANDARD'} > Standard</option>
            <option key={'ROLE_BETA'} value={'ROLE_BETA'}> Beta Tester</option>
            <option key={'ROLE_ADMIN'} value={'ROLE_ADMIN'} > Admin</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label check></Label>
            <Input type="checkbox" onChange={this.handleChangeAvailable} />
            Avaliable
          
        </FormGroup>
      </Form>);
    {/*}
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
            id="avaliable"
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
            <MenuItem key={false} value={false}> No </MenuItem>
            <MenuItem key={true} value={true}> Yes </MenuItem>
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

      </form>
          */}

  }
} ServerForm.propTypes = {
  change: PropTypes.func.isRequired,
  data: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ServerForm);
