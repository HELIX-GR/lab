import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ActionInfo from '@material-ui/icons/Info';
import { FormattedTime, FormattedMessage } from 'react-intl';

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

          <ListItemText primary={row.name} secondary={row.description} />{//row.startedAt ? <FormattedTime value={row.startedAt} day='numeric' month='numeric' year='numeric' /> : "---"} />
          }
        </ListItem>
      )
      )}
    </List>
  </div>

);




const ServerList = ({ servers, onClick, selectedIndex }) => (
  <div className="main-results-result-count-lab">
    <a> Select a server to run your notebooks and see your files</a>

    <div className="result-items">
      {servers.map((row, index) => (

        <div className="result-item lab"
          onClick={event => onClick(event, row.id)}
          key={row.id}
          value={row.id}>
          <div className="date-of-entry">
            <div>{row.startedAt ? <FormattedTime value={row.startedAt} day='numeric' month='numeric' year='numeric' /> : "---"} </div>
          </div>
          <h3 className="title">
            <a className="mr-2" >{row.name} </a>
            <div className="pill data">
              {row.memory}GB RAM
          </div>
            <div className="pill data">
              {row.virtualCores} VC
          </div>
          </h3>

          <div className="service">
            <a >{row.description}</a>
          </div>
          <div className="tag-list">
            {row.tags.map((tag) => (
              <a key={tag} className="tag-box tag-box-other">{tag} </a>
            ))}
          </div>
        </div>
      )
      )}
    </div>
  </div>

);

export default ServerList;
