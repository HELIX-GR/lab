import _ from 'lodash';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import Button from '@material-ui/core/Button';
import Select from 'react-select';

const roles = [
  { value: 'ROLE_STANDARD', label: 'Standard' },
  { value: 'ROLE_STANDARD_STUDENT', label: 'Standard Student' },
  { value: 'ROLE_STANDARD_ACADEMIC', label: 'Standard Academic' },
  { value: 'ROLE_BETA', label: 'Beta Tester' },
  { value: 'ROLE_BETA_STUDENT', label: 'Beta Tester Student' },
  { value: 'ROLE_BETA_ACADEMIC', label: 'Beta Tester Academic' },
];

class WhiteListForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      roles: ["ROLE_STANDARD"],
      kernels: [],
    };
  }

  onAccept() {
    this.props.accept(this.state);
  }

  onChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  onRoleChange(role) {
    this.setState({
      roles: [role]
    });
  }

  onKernelChange(value) {
    this.setState({
      kernels: value.map(kernel => kernel.value),
    });
  }

  render() {
    const { kernels } = this.props;
    const allKernels = kernels.map(k => ({ label: k.tag, value: k.name, index: k.index }));

    const selectedKernels = _.orderBy(
      this.state.kernels.map(value => {
        const kernel = kernels.find((k) => k.name === value);
        return { label: kernel.tag, value: kernel.name, index: kernel.index };
      }),
      ['index']
    );

    return (
      <div>
        <Form noValidate autoComplete="off">
          <FormGroup >
            <Label for="firstName">First Name</Label>
            <Input type="text"
              id="firstName"
              name="firstName"
              value={this.state.firstName}
              onChange={(e) => this.onChange(e)}
            />
          </FormGroup>
          <FormGroup >
            <Label for="lastName">Last Name</Label>
            <Input type="text"
              id="lastName"
              name="lastName"
              value={this.state.lastName}
              onChange={(e) => this.onChange(e)}
            />
          </FormGroup>
          <FormGroup >
            <Label for="lastName">Email</Label>
            <Input type="text"
              id="email"
              name="email"
              autoComplete="new-email"
              value={this.state.email}
              onChange={(e) => this.onChange(e)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="eligibleRole">Role eligible</Label>
            <Select
              id="eligibleRole"
              title="Choose the role a user must have to see this server?"
              options={roles}
              value={roles.find(r => r.value === this.state.roles[0])}
              onChange={(e) => this.onRoleChange(e.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="kernels">Select Kernels</Label>
            <Select
              isClearable
              isMulti
              name="kernels"
              options={allKernels}
              value={selectedKernels}
              onChange={(value) => this.onKernelChange(value)}
            />
          </FormGroup>
        </Form>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button color="secondary" onClick={() => this.props.cancel()}>Cancel</Button>{' '}
          <Button color="primary" onClick={() => this.onAccept()}>Submit</Button>
        </div>
      </div >
    );

  }
}

WhiteListForm.propTypes = {
  accept: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};

export default WhiteListForm;
