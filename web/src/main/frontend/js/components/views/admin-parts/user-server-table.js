import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { FormattedTime } from 'react-intl';
import { removeUserServer } from '../../../ducks/admin';
import { toast } from 'react-toastify';

import ReactTable from 'react-table';

class UserServerTable extends React.Component {

  removeUserServer(event, id) {
    event.preventDefault();

    this.props.removeUserServer(id)
      .catch(() => {
        toast.error('Failed to stop user Notebook Server');
      });
  }

  render() {
    const { kernels, userServers: data } = this.props;

    const columns = [{
      Header: 'id',
      accessor: 'id',
      show: false,
    }, {
      Header: 'User',
      accessor: 'User',
      headerStyle: { textAlign: 'left' },
      Cell: props => (
        <span>{props.original.account.email}</span>
      ),
      width: 220,
    }, {
      Header: 'Server',
      accessor: 'name',
      headerStyle: { textAlign: 'left' },
      width: 200,
    }, {
      Header: 'Kernel',
      accessor: 'kernel',
      headerStyle: { textAlign: 'left' },
      width: 200,
      Cell: props => (
        <span>{kernels.find(k => k.name === props.value).tag}</span>
      ),
    }, {
      Header: 'URL',
      accessor: 'url',
      headerStyle: { textAlign: 'left' },
      Cell: props => (
        <a href={props.value} target="_blank">{props.value}</a>
      ),
    }, {
      Header: 'Started At',
      id: 'startedAt',
      accessor: 'startedAt',
      style: { textAlign: 'center' },
      headerStyle: { textAlign: 'center' },
      Cell: props => (
        <FormattedTime value={props.value} day='numeric' month='numeric' year='numeric' />
      ),
      width: 150,
    }, {
      Header: '',
      style: { textAlign: 'center', cursor: 'pointer' },
      Cell: props => (
        <a onClick={(e) => this.removeUserServer(e, props.original.id)}>
          <i className="fa fa-trash"></i>
        </a>
      ),
      width: 30,
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

const mapStateToProps = (state) => ({
  kernels: state.config.kernels,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  removeUserServer,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserServerTable);
