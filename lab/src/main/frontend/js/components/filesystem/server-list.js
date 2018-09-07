import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ActionInfo from '@material-ui/icons/Info';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import { FormattedTime, FormattedMessage } from 'react-intl';
import { UncontrolledTooltip } from 'reactstrap';




const ServerList2 = ({ servers, onClick, selectedIndex }) => (
  <div>
    <List value={selectedIndex} onChange={onClick}>
      <ListSubheader inset={true}><FormattedMessage id="server-list.servers" defaultMessage="Avaliable Servers" /></ListSubheader>
      {servers.map((row, index) => (

        <ListItem button={true}
          onClick={event => onClick(event, row.id)}
          key={row.id}
          value={row.id}
        >
          <Avatar>
            <i className="fa fa-server"></i>
          </Avatar>

          <ListItemText primary={row.name} secondary={row.description} />{//row.started_at ? <FormattedTime value={row.started_at} day='numeric' month='numeric' year='numeric' /> : "---"} />
          }
        </ListItem>
      )
      )}
    </List>
  </div>

);




const ServerList = ({ servers, onClick, selectedIndex }) => (
  <div className="main-results-result-count-lab">
    <div className="result-items">
      {servers.map((row, index) => (

        <div className="result-item lab"
          onClick={event => onClick(event, row.id)}
          key={row.id}
          value={row.id}>
          <div className="date-of-entry">
            <div>{row.started_at ? <FormattedTime value={row.started_at} day='numeric' month='numeric' year='numeric' /> : "---"} </div>
          </div>
          <h3 className="title">
            <a className="mr-2" >{row.name} </a>
            <div className="pill data">
              1GB RAM
          </div>
            <div className="pill data">
              1VC
          </div>
          </h3>

          <div className="service">
            <a >{row.description}</a>
          </div>
          <div className="tag-list">
            <a className="tag-box tag-box-other">Python </a>
            <a className="tag-box tag-box-other">R </a>
            <a className="tag-box first-tag" >LAB</a>
          </div>
        </div>
      )
      )}
    </div>
  </div>

);

export default ServerList;
