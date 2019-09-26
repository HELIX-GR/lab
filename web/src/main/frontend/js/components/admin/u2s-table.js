import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { FormattedTime } from 'react-intl';
import ReactTable from "react-table";
import { removeUserServer } from "./../../ducks/admin";

const all_roles = ["ROLE_STANDARD", "ROLE_STANDARD_STUDENT", "ROLE_STANDARD_ACADEMIC", "ROLE_BETA", "ROLE_BETA_STUDENT", "ROLE_BETA_ACADEMIC"];



export class U2sTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 15,
    };
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };


  render() {
    const UserColumns = [
      {
        Header: 'ID',
        accessor: 'id',
        maxWidth: 33,
        show: false,
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'URL',
        accessor: 'url',
      },
      {
        Header: 'Started At',
        id: 'startedAt',
        accessor: 'startedAt',
        Cell: props => (
          <FormattedTime value={props.value} day='numeric' month='numeric' year='numeric' />
        ),
        width: 150,
      },
      {
        Header: '',
        Cell: props => (
          <button onClick={() => (this.props.removeUserServer(props.original.id))}>
            <i className="fa fa-trash"></i>
          </button>
        ),
        width: 44,
      }
    ];



    var data = this.props.userServers;
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


function mapStateToProps(state) {
  return {

  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ removeUserServer }, dispatch);



export default U2sTable = connect(mapStateToProps, mapDispatchToProps)(U2sTable);
