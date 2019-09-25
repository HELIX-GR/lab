import React from "react";
import * as PropTypes from 'prop-types';
import { FormattedTime } from 'react-intl';
import ReactTable from 'react-table';
import ModalEditServer from './modal-edit-server';


export class AdminTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 15,
    };
  }



  render() {
    var data = this.props.servers;

    const UserColumns = [
      {
        Header: '',
        maxWidth: 33,
      Cell: props=> (<ModalEditServer data={this.props.servers.filter(srv => srv.id == props.original.id)[0]}/>),
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'URL',
        accessor: 'url',
      },
      {
        Header: 'Available',
        accessor: 'available',
        maxWidth: 80,
        Cell: props => (props.value ? <i className="fa fa-check"></i> : <i className="fa fa-times"></i>),
      },
      {
        Header: 'Last Modified',
        id: 'startedAt',
        accessor: 'startedAt',
        Cell: props => (
          <FormattedTime value={props.value} day='numeric' month='numeric' year='numeric' />
        ),
        width: 150,
      },
      {
        Header: 'Role Eligible',
        accessor: 'eligibleRole',
      },];

    const { rowsPerPage, page } = this.state;
    //const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <div className="helix-table-container">
        <ReactTable
          data={data}
          columns={UserColumns}
          defaultPageSize={rowsPerPage}
          className="-striped -highlight"
        />
      </div >
    );
  }
}
AdminTable.propTypes = {
  servers: PropTypes.array,
  serverEdit: PropTypes.func.isRequired,
};

