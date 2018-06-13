import React from 'react';
import Paper from 'material-ui/Paper';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import { blue500, yellow600 } from 'material-ui/styles/colors';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';
import { FormattedTime, FormattedMessage } from 'react-intl';


let SelectableList = makeSelectable(List);


const ServerList = ({ servers, onClick, selectedIndex }) => (
  <div>
    <SelectableList value={selectedIndex} onChange={onClick}>
      <Subheader inset={true}><FormattedMessage id="server-list.servers" defaultMessage="Avaliable Servers" /></Subheader>
      {servers.map((row, index) => (
        <ListItem
          key={row.id}
          
          value={row.id}
          leftAvatar={<Avatar icon={<i className="fas fa-server"></i>} />}
          rightIcon={<ActionInfo />}
          primaryText={row.name}
          secondaryText={row.started_at ? <FormattedTime value={row.started_at} day='numeric' month='numeric' year='numeric' /> : "---"}
        />)
      )}
    </SelectableList>
    <Divider inset={true} />
    <List>
      <Subheader inset={true}>Files</Subheader>
      <ListItem
        leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={blue500} />}
        rightIcon={<ActionInfo />}
        primaryText="Vacation itinerary"
        secondaryText="Jan 20, 2014"
      />
      <ListItem
        leftAvatar={<Avatar icon={<EditorInsertChart />} backgroundColor={yellow600} />}
        rightIcon={<ActionInfo />}
        primaryText="Kitchen remodel"
        secondaryText="Jan 10, 2014"
      />
    </List>
  </div>
);

export default ServerList;
