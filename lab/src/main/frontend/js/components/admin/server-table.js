import React from "react";
import * as PropTypes from 'prop-types';
import { FormattedTime } from 'react-intl';
import ReactTable from "react-table";



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
        Cell: <i className="fa fa-server" />,
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
        id: 'started_at',
        accessor: 'started_at',
        Cell: props => (
          <FormattedTime value={props.value} day='numeric' month='numeric' year='numeric' />
        ),
        width: 150,
      },
      {
        Header: 'Role Eligible',
        accessor: 'role_eligible',
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
};

