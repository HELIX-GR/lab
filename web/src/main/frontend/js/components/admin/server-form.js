import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Col, Row, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';

const options = [
  { value: 'ROLE_STANDARD', label: 'Standard' },
  { value: 'ROLE_BETA', label: 'Beta Tester' },
  { value: 'ROLE_ADMIN', label: 'Admin' }
];

const tagOptions = [
  { value: 'Python', label: 'Python' },
  { value: 'R', label: 'R' },
  { value: 'Data Science', label: 'Data Science' },
  { value: 'Lite', label: 'Lite' },
  { value: 'GeoNotebook', label: 'GeoNotebook' },
  { value: 'scipy', label: 'scipy' },
];

class ServerForm extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeAvailable = this.handleChangeAvailable.bind(this);
    this.handleChangeRole = this.handleChangeRole.bind(this);

    this.state = {
      name: this.props.data.name || "",
      url: this.props.data.url || "",
      description: this.props.data.description || "",
      token: this.props.data.token || "",
      available: this.props.data.available,
      memory: this.props.data.memory,
      virtualCores: this.props.data.virtualCores,
      eligibleRole: "ROLE_STANDARD",
      tags: this.props.data.tags || [],
    };

  }

  handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value }, () => { this.props.change(this.state); });
  }

  handleChangeAvailable = () => {
    this.setState({ available: !this.state.available }, () => { this.props.change(this.state); });
  }

  handleChangeRole = (value) => {
    this.setState({ eligibleRole: value }, () => { this.props.change(this.state); });
  }

  handleChangeTags = (newValue, actionMeta) => {
    var arr = [];
    newValue.map(s => { arr.push(s.value); });
    this.setState({ tags: arr }, () => { this.props.change(this.state); });
  };

  getValue = (val) => {
    // To work around react-select's weird input api
    if (val) {
      return ({
        label: options.find(a => a.value == val).label,
        value: val
      });
    }
  };
  getTagValue = (val) => {
    // To work around react-select's weird input api
    if (val) {
      return ({
        label: val,
        value: val
      });
    }
  };

  render() {
    return (
      <Form onClose={this.props.handleClose}>
        <FormGroup >
          <Label for="name">Name</Label>
          <Input type="text" name="name" id="name" value={this.state.name} placeholder="Give a name to your server" onChange={this.handleChange} />
        </FormGroup>
        <FormGroup>
          <Label for="url">URL</Label>
          <Input type="url" name="url" id="url" value={this.state.url} placeholder="A valid url" onChange={this.handleChange} />
        </FormGroup>
        <FormGroup>
          <Label for="token">Admin token</Label>
          <Input type="text" name="token" id="token" value={this.state.token} placeholder="A valid admin token for the server" onChange={this.handleChange} />
        </FormGroup>
        <FormGroup>
          <Label for="description">Description</Label>
          <Input type="textarea" name="description" id="description" value={this.state.description} placeholder="Description visible to user." onChange={this.handleChange} />
        </FormGroup>
        <Row >
          <Col md={6}>
            <FormGroup>
              <Label for="eligibleRole">Select role eligible</Label>
              <Select
                id="eligibleRole"
                title="Choose the role a user must have to see this server?"
                options={options}
                value={this.getValue(this.state.eligibleRole)}
                onChange={e => this.handleChangeRole(e.value)}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for="memory">Ram</Label>
              <Input type="number" name="memory" id="memory" value={this.state.memory} onChange={this.handleChange} />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for="virtualCores">Virtual CPUs</Label>
              <Input type="number" name="virtualCores" id="virtualCores" value={this.state.virtualCores} onChange={this.handleChange} />
            </FormGroup>
          </Col>
        </Row>

        <FormGroup>
          <Label for="tags">Select tags</Label>
          <CreatableSelect
            isClearable
            isMulti
            name="tags"
            options={tagOptions}
            value={this.state.tags.map(tag => (this.getTagValue(tag)))}
            onChange={this.handleChangeTags}
          />

        </FormGroup>
        <FormGroup>
          <Label check></Label>
          <input type="checkbox" checked={this.state.available} id="available" onChange={this.handleChangeAvailable} />
          {' '}Available
        </FormGroup>
      </Form>);
  }
} ServerForm.propTypes = {
  change: PropTypes.func.isRequired,
  data: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};

export default ServerForm;
