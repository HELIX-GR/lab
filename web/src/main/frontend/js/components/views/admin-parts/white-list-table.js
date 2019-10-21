import React from "react";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { FormattedTime } from 'react-intl';
import Checkbox from '@material-ui/core/Checkbox';
import ReactTable from "react-table";

import { RoleGroups } from '../../../model';

import {
  grantWhiteListRole, 
  revokeWhiteList,
} from '../../../ducks/admin';

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
    const { kernels, users: data } = this.props;

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
      ),
      width: 180,
    }, {
      Header: 'Created',
      id: 'registeredOn',
      accessor: 'registeredOn',
      headerStyle: { textAlign: 'center' },
      style: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
      Cell: props => (
        <FormattedTime value={props.value} day='numeric' month='numeric' year='numeric' />
      ),
      width: 140,
    }, {
      Header: 'Allowed Kernels',
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
    },
    ...RoleGroups.LAB.map(name => {
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

const mapStateToProps = (state) => ({
  kernels: state.config.kernels,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  grantWhiteListRole,
  revokeWhiteList
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WhiteListTable);
