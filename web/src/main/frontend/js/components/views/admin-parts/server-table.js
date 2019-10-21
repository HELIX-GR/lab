import React from "react";
import * as PropTypes from 'prop-types';

import { FormattedTime } from 'react-intl';
import ReactTable from 'react-table';

import ModalEditServer from './modal-edit-server';
import Icon from '@mdi/react';
import { mdiServerNetwork, mdiServerNetworkOff } from '@mdi/js';

class ServerTable extends React.Component {

  static propTypes = {
    kernels: PropTypes.array,
    servers: PropTypes.array,
  }

  render() {
    const { kernels, servers: data } = this.props;

    const columns = [{
      Header: '',
      accessor: 'available',
      headerStyle: { textAlign: 'center' },
      style: { textAlign: 'center' },
      maxWidth: 33,
      Cell: props => (
        <Icon path={props.value ? mdiServerNetwork : mdiServerNetworkOff} size={'16px'} color={props.value ? '#1B5E20' : '#b71c1c'} />
      ),
    }, {
      Header: '',
      maxWidth: 33,
      style: { textAlign: 'center', cursor: 'pointer' },
      Cell: props => (
        <ModalEditServer server={this.props.servers.find(s => s.id == props.original.id)} />
      ),
    }, {
      Header: 'Name',
      accessor: 'name',
      headerStyle: { textAlign: 'left' },
    }, {
      Header: 'URL',
      accessor: 'url',
      headerStyle: { textAlign: 'left' },
      Cell: props => (
        <a href={props.value} target="_blank">{props.value}</a>
      ),
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
    }, {
      Header: 'Supported Kernels',
      headerStyle: { textAlign: 'left' },
      accessor: 'kernels',
      style: { display: 'flex', alignItems: 'center', flexWrap: 'wrap' },
      Cell: props => (
        <React.Fragment>
          {props.original.kernels.map(name => {
            const kernel = kernels.find(k => k.name === name);
            return (
              <a key={kernel.name} className="tag-box tag-box-other">
                {kernel.tag}
              </a>
            );
          })}
        </React.Fragment>
      )
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

export default ServerTable;