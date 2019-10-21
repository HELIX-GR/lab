import _ from 'lodash';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Col, Row, Form, FormGroup, Label, Input } from 'reactstrap';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';

const roles = [
  { value: 'ROLE_STANDARD', label: 'Standard' },
  { value: 'ROLE_BETA', label: 'Beta Tester' },
  { value: 'ROLE_ADMIN', label: 'Admin' }
];

const tags = [
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
  }

  static propTypes = {
    server: PropTypes.object,
  };

  handleChange(event) {
    const { change } = this.props;
    change({
      [event.target.id]: event.target.value,
    });
  }

  handleChangeAvailable() {
    const { change, server } = this.props;
    change({
      available: !server.available
    });
  }

  handleChangeRole(value) {
    const { change } = this.props;
    change({
      eligibleRole: value
    });
  }

  handleChangeTags(value) {
    const { change } = this.props;
    change({
      tags: value.map(tag => tag.value),
    });
  }

  handleChangeKernels(value) {
    const { change } = this.props;
    change({
      kernels: value.map(kernel => kernel.value),
    });
  }

  render() {
    const { kernels, server } = this.props;
    const allKernels = kernels.map(k => ({ label: k.tag, value: k.name, index: k.index }));

    const selectedKernels = _.orderBy(
      server.kernels.map(value => {
        const kernel = kernels.find((k) => k.name === value);
        return { label: kernel.tag, value: kernel.name, index: kernel.index };
      }),
      ['index']
    );

    return (
      <Form>
        <FormGroup >
          <Label for="name">Name</Label>
          <Input type="text" name="name" id="name" value={server.name} placeholder="Give a name to your server" onChange={this.handleChange} />
        </FormGroup>
        <FormGroup>
          <Label for="url">URL</Label>
          <Input type="url" name="url" id="url" value={server.url} placeholder="A valid url" onChange={this.handleChange} />
        </FormGroup>
        <FormGroup>
          <Label for="token">Admin token</Label>
          <Input type="text" name="token" id="token" value={server.token} placeholder="A valid admin token for the server" onChange={this.handleChange} />
        </FormGroup>
        <FormGroup>
          <Label for="description">Description</Label>
          <Input type="textarea" name="description" id="description" value={server.description} placeholder="Description visible to user." onChange={this.handleChange} />
        </FormGroup>
        <Row >
          <Col md={6}>
            <FormGroup>
              <Label for="eligibleRole">Select role eligible</Label>
              <Select
                id="eligibleRole"
                title="Choose the role a user must have to see this server?"
                options={roles}
                value={roles.find(r => r.value === server.eligibleRole)}
                onChange={(e) => this.handleChangeRole(e.value)}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for="memory">Ram</Label>
              <Input type="number" name="memory" id="memory" value={server.memory} onChange={this.handleChange} />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for="virtualCores">Virtual CPUs</Label>
              <Input type="number" name="virtualCores" id="virtualCores" value={server.virtualCores} onChange={this.handleChange} />
            </FormGroup>
          </Col>
        </Row>

        <FormGroup>
          <Label for="tags">Select tags</Label>
          <CreatableSelect
            isClearable
            isMulti
            name="tags"
            options={tags}
            value={server.tags.map(tag => ({ label: tag, value: tag }))}
            onChange={(value) => this.handleChangeTags(value)}
          />
        </FormGroup>

        <FormGroup>
          <Label for="kernels">Select Kernels</Label>
          <CreatableSelect
            isClearable
            isMulti
            name="kernels"
            options={allKernels}
            value={selectedKernels}
            onChange={(value) => this.handleChangeKernels(value)}
          />
        </FormGroup>

        <FormGroup>
          <Label check></Label>
          <input type="checkbox" checked={server.available} id="available" onChange={this.handleChangeAvailable} />
          {' '}Available
        </FormGroup>
      </Form>);
  }
}

export default ServerForm;
