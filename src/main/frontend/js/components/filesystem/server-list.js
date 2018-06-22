import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import ActionInfo from '@material-ui/icons/Info';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import ActionAssignment from '@material-ui/icons/Assignment';
import { FormattedTime, FormattedMessage } from 'react-intl';




const ServerList = ({ servers, onClick, selectedIndex }) => (
  <div>
    <List value={selectedIndex} onChange={onClick}>
      <ListSubheader inset={true}><FormattedMessage id="server-list.servers" defaultMessage="Avaliable Servers" /></ListSubheader>
      {servers.map((row, index) => (
        <ListItem button={true}
        onClick={event => onClick(event,row.id)}
          key={row.id}
          value={row.id}
        >
          <Avatar>
            <i className="fa fa-server"></i>
          </Avatar>
          <ListItemText primary={row.name} secondary={row.started_at ? <FormattedTime value={row.started_at} day='numeric' month='numeric' year='numeric' /> : "---"} />
          <ListItemSecondaryAction> <ActionInfo /> </ListItemSecondaryAction>
        </ListItem>)
      )}
    </List>
    <Divider inset={true} />

  </div>
);

export default ServerList;