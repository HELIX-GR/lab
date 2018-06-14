import React, { Component } from 'react';
import * as PropTypes from 'prop-types';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

const styles = {
  customWidth: {
    width: 150,
  },
};

/**
 * `SelectField` is implemented as a controlled component,
 * with the current selection set through the `value` property.
 * The `SelectField` can be disabled with the `disabled` property.
 */
export default class ServerForm extends Component {
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
      role_eligible: "ROLE_USER"
    };
  }

  handleSubmit() {
    this.props.finish(this.state);
  }
  handleChange = (event) => this.setState({ [event.target.id]: event.target.value });
  handleChangeAvailable = (event, index, value) => this.setState({ available: value });
  handleChangeRole = (event, index, value) => this.setState({ role_eligible: value });

  render() {
    return (
      <div>
        <TextField
          hintText="Give a name to your server"
          floatingLabelText="Name"
          value={this.state.name}
          onChange={this.handleChange}
          id="name"
          fullWidth={true}
        /><br />
        <TextField
          hintText="A valid url"
          floatingLabelText="url"
          value={this.state.url}
          onChange={this.handleChange}
          id="url"
          fullWidth={true}
        /><br />
        <TextField
          hintText="Description visible to user"
          floatingLabelText="description"
          value={this.state.description}
          onChange={this.handleChange}
          multiLine={true}
          rows={2}
          id="description"
          fullWidth={true}
        /><br /> <TextField
          hintText="Admin token"
          floatingLabelText="Admin token"
          value={this.state.admin_token}
          onChange={this.handleChange}
          id="admin_token"
          fullWidth={true}
        />
        <br />
        <SelectField
          floatingLabelText="Make available"
          value={this.state.available}
          onChange={this.handleChangeAvailable}
        >
          <MenuItem id="available" value={false} primaryText="No" />
          <MenuItem id="available" value={true} primaryText="Yes" />
        </SelectField>

        <SelectField
          floatingLabelText="Role eligible"
          value={this.state.role_eligible}
          onChange={this.handleChangeRole}
        >
          <MenuItem value={'ROLE_USER'} primaryText="USER" />
          <MenuItem value={'ROLE_STUDENT'} primaryText="STUDENT" />
          <MenuItem value={'ROLE_TESTER'} primaryText="EXPERIMENTAL" />
          <MenuItem value={'ROLE_OTHER'} primaryText="OTHER" />
          <MenuItem value={'ROLE_ADMIN'} primaryText="ADMIN" />
        </SelectField>
        <FlatButton
          label="Cancel"
          primary={true}
          onClick={this.props.onClose}
        />,
      <FlatButton
          label="Submit"
          primary={true}
          keyboardFocused={true}
          onClick={this.handleSubmit}
        />

      </div>
    );
  }
} ServerForm.propTypes = {
  finish: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};