import React from "react";
import * as PropTypes from 'prop-types';

import { FormattedTime } from 'react-intl';
import ReactTable from 'react-table';

import ModalEditServer from './modal-edit-server';

export class AdminTable extends React.Component {

  static propTypes = {
    servers: PropTypes.array,
    serverEdit: PropTypes.func.isRequired,
  }

  render() {
    const data = this.props.servers;

    const columns = [{
      Header: '',
      maxWidth: 33,
      style: { textAlign: 'center', cursor: 'pointer' },
      Cell: props => (
        <ModalEditServer data={this.props.servers.filter(srv => srv.id == props.original.id)[0]} />
      ),
    }, {
      Header: 'Name',
      accessor: 'name',
      headerStyle: { textAlign: 'left' },
    }, {
      Header: 'URL',
      accessor: 'url',
      headerStyle: { textAlign: 'left' },
    }, {
      Header: 'Available',
      accessor: 'available',
      headerStyle: { textAlign: 'center' },
      style: { textAlign: 'center' },
      maxWidth: 80,
      Cell: props => (props.value ? <i className="fa fa-check"></i> : <i className="fa fa-times"></i>),
    }, {
      Header: 'Last Modified',
      id: 'startedAt',
      accessor: 'startedAt',
      headerStyle: { textAlign: 'center' },
      style: { textAlign: 'center' },
      Cell: props => (
        <FormattedTime value={props.value} day='numeric' month='numeric' year='numeric' />
      ),
      width: 150,
    }, {
      Header: 'Role Eligible',
      accessor: 'eligibleRole',
      headerStyle: { textAlign: 'center' },
      style: { textAlign: 'center' },
      width: 150,
      Cell: props => (
        <span>{props.value.split('_')[1]}</span>
      ),
    }];

    return (
      <div className="helix-table-container">
        <ReactTable
          data={data}
          columns={columns}
          defaultPageSize={10}
          showPageSizeOptions={false}
          className="-striped -highlight"
        />
      </div >
    );
  }
}
