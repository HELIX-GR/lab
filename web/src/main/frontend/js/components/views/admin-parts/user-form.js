import _ from 'lodash';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import CreatableSelect from 'react-select/lib/Creatable';


import {
  RoleGroups,
  RoleNames,
} from '../../../model';

class UserForm extends Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  static propTypes = {
    user: PropTypes.object,
  };

  handleChange(event) {
    const { change } = this.props;
    change({
      [event.target.id]: event.target.value,
    });
  }

  handleChangeRoles(value) {
    const { change } = this.props;
    change({
      roles: value.map(role => role.value),
    });
  }

  handleChangeKernels(value) {
    const { change } = this.props;
    change({
      kernels: value.map(kernel => kernel.value),
    });
  }

  render() {
    const { kernels, user } = this.props;

    const allKernels = kernels.map(k => ({ label: k.tag, value: k.name, index: k.index }));

    const selectedKernels = _.orderBy(
      user.kernels.map(value => {
        const kernel = kernels.find((k) => k.name === value);
        return { label: kernel.tag, value: kernel.name, index: kernel.index };
      }),
      ['index']
    );

    const allRoles = RoleGroups.ALL.map(r => ({ label: RoleNames[r], value: r }));
    const selectedRoles = user.roles.map(value => {
      const role = allRoles.find(r => r.value === value);
      return { label: RoleNames[role.value], value: role.value };
    });

    return (
      <Form>
        <FormGroup >
          <Label for="email">Email</Label>
          <Input type="text" name="email" id="email" value={user.email} readOnly />
        </FormGroup>
        <FormGroup>
          <Label for="givenName">First Name</Label>
          <Input type="givenName" name="givenName" id="givenName" value={user.givenName || ''} readOnly />
        </FormGroup>
        <FormGroup>
          <Label for="familyName">Last Name</Label>
          <Input type="text" name="familyName" id="familyName" value={user.familyName || ''} readOnly />
        </FormGroup>

        <FormGroup>
          <Label for="roles">Select roles</Label>
          <CreatableSelect
            isClearable
            isMulti
            name="roles"
            options={allRoles}
            value={selectedRoles}
            onChange={(value) => this.handleChangeRoles(value)}
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
      </Form>);
  }
}

export default UserForm;
