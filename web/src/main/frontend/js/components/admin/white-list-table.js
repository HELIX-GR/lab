import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { grantWhiteListRole, revokeWhiteList } from '../../ducks/admin';
import { FormattedTime } from 'react-intl';

import Checkbox from '@material-ui/core/Checkbox';
import ReactTable from "react-table";

import { Roles } from '../../model';

class WhiteListTable extends React.Component {

  constructor(props) {
    super(props);

    this.updateCheck = this.updateCheck.bind(this);
  }

  updateCheck(is, r, user_id) {
    if (is) {
      this.props.grantWhiteListRole(user_id, r);
    } else {
      this.props.revokeWhiteList(user_id, r);
    }
  }

  render() {
    const data = this.props.users;

    const columns = [{
      Header: 'id',
      accessor: 'id',
      show: false,
    }, {
      Header: 'Email',
      headerStyle: { textAlign: 'left' },
      accessor: 'email',
      style: { display: 'flex', alignItems: 'center' },
      Cell: props => (
        <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{props.value}</div>
      )
    }, {
      Header: 'Full Name',
      headerStyle: { textAlign: 'left' },
      accessor: 'fullName',
      style: { display: 'flex', alignItems: 'center' },
      Cell: props => (
        <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {[props.original.firstName, props.original.lastName].join(' ')}
        </div>
      )
    }, {
      Header: 'Created',
      id: 'registeredOn',
      accessor: 'registeredOn',
      headerStyle: { textAlign: 'center' },
      style: { display: 'flex', alignItems: 'center' },
      Cell: props => (
        <FormattedTime value={props.value} day='numeric' month='numeric' year='numeric' />
      ),
      width: 150,
    },
    ...Roles.LAB.map(name => {
      return ({
        Header: <img className="account-icon" src={"/images/png/" + name + ".png"} height="35" width="35" />,
        id: name,
        accessor: 'roles',
        Cell: props => (<Checkbox
          checked={props.value.includes(name)}
          onChange={(e, is) => { this.updateCheck(is, name, props.row.id); }}
        />
        ),
        width: 60,
      });
    })];

    return (
      <div className="helix-table-container">
        <ReactTable
          data={data}
          noDataText="No White-Listed Users to display"
          columns={columns}
          defaultPageSize={10}
          showPageSizeOptions={false}
          className="-striped -highlight"
        />
      </div >
    );
  }

}

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  grantWhiteListRole,
  revokeWhiteList
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WhiteListTable);
