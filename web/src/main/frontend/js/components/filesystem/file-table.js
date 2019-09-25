import React from 'react';
import ActionDone from '@material-ui/icons/Done';
import ContentClear from '@material-ui/icons/Clear';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import formatFileSize from '../../util/file-size';
import { FormattedMessage } from 'react-intl';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import _ from 'lodash';


export default function FileTable({ props }) {
  const { data, new_folder, handleRowClick, handleRowDoubleClick, formatRelative, handleCreateFolder, setNewFolder, folder, last_update, handleNameChange, value_folder, selected_file } = props;
  return (
    <div className="filesystem-box">
      <Table >
        <TableHead>
          <TableRow  >
            <TableCell width="66px" tooltip="The ID">  </TableCell>
            <TableCell tooltip="File Name"><FormattedMessage id="filetable.FileName" defaultMessage="File Name" /></TableCell>
            <TableCell tooltip="File type"><FormattedMessage id="filetable.FileType" defaultMessage="File Type" /></TableCell>
            <TableCell tooltip="File Size"><FormattedMessage id="filetable.FileSize" defaultMessage="File Size" /></TableCell>
            <TableCell tooltip="Last Modified"><FormattedMessage id="filetable.LastModified" defaultMessage="Last Modified" /></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {(_.isEmpty(data) && !new_folder) ?
            <TableRow >
              <TableCell />
              <TableCell width="300px" style={{ textAlign: 'center' }}> No Data </TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
            : (data.map((row, index) => (
              <TableRow
                hover
                onClick={event => handleRowClick(event, index, row.type, row.name)}
                onDoubleClick={event => handleRowDoubleClick(event, index, row.type, row.name)}
                key={index}
                selected={row.name === selected_file}>
                <TableCell width="66px" >{row.type === 'Folder' ?
                  <i className="fa fa-folder" />
                  : row.type === 'file' ?
                    <i className="fa fa-file" />
                    : <i className="fa fa-file-code" />}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{formatFileSize(row.size)}</TableCell>
                <TableCell>
                  {formatRelative(row.createdOn)}
                </TableCell>
              </TableRow>
            )))}
          {new_folder ?
            <TableRow key={"NewFile"} >
              <TableCell width="66px" >
                <i className="fa fa-folder" />
              </TableCell>
              <TableCell>
                <TextField
                  id="text-field-controlled"
                  value={value_folder}
                  onChange={event => { handleNameChange(event.target.value); }}
                />
              </TableCell>
              <TableCell>
                <Button variant="fab" mini={true} secondary={true} style={{
                  marginRight: 20,
                }} onClick={(e) => { handleCreateFolder(folder.path + value_folder); }} >
                  <ActionDone />
                </Button>
                <Button variant="fab" mini={true} secondary={true} style={{
                  marginRight: 20,
                }}
                  onClick={(e) => {
                    setNewFolder(false);
                  }} >
                  <ContentClear />
                </Button>
              </TableCell>
            </TableRow>
            : null
          }
        </TableBody>
        <TableFooter >
          <TableRow >
            <TableCell />
            <TableCell width="300px">
              {last_update && <FormattedMessage id="filetable.LastUpdate" defaultMessage="Last Update: " />}
              {last_update && formatRelative(last_update)}
            </TableCell>
          </TableRow>

        </TableFooter>
      </Table>
    </div>
  );
}