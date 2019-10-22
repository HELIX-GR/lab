import _ from 'lodash';
import React from 'react';

import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

import ActionDone from '@material-ui/icons/Done';
import ContentClear from '@material-ui/icons/Clear';

import formatFileSize from '../../util/file-size';

import { FormattedMessage, FormattedTime } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';

import moment from '../../moment-localized';

const useStyles = makeStyles({
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto',
  },
});

export default function FileTable({ props }) {
  const classes = useStyles();

  const {
    data,
    folder,
    folderName,
    handleCreateFolder,
    handleNameChange,
    handleRowClick,
    handleRowDoubleClick,
    newFolder,
    selectedFile,
    setNewFolder,
    showFoldersOnly,
    updatedAt,
  } = props;

  return (
    <div className="filesystem-box">
      {updatedAt &&
        <a className="text-muted small">Last update before {moment.duration(Date.now() - updatedAt).humanize()}</a>
      }
      <div className={classes.tableWrapper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow  >
              <TableCell width="66px"></TableCell>
              <TableCell tooltip="File Name"><FormattedMessage id="filetable.FileName" defaultMessage="File Name" /></TableCell>
              <TableCell tooltip="File type"><FormattedMessage id="filetable.FileType" defaultMessage="File Type" /></TableCell>
              <TableCell tooltip="File Size"><FormattedMessage id="filetable.FileSize" defaultMessage="File Size" /></TableCell>
              <TableCell tooltip="Last Modified"><FormattedMessage id="filetable.LastModified" defaultMessage="Last Modified" /></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(_.isEmpty(data) && !newFolder) ?
              <TableRow >
                <TableCell />
                <TableCell width="300px" style={{ textAlign: 'center' }}> No Data </TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
              : (data
                .filter(row => !showFoldersOnly || row.type === 'Folder')
                .map((row, index) => (
                  <TableRow
                    hover
                    onClick={event => handleRowClick(event, index, row.type, row.name)}
                    onDoubleClick={event => handleRowDoubleClick(event, index, row.type, row.name)}
                    key={index}
                    selected={row.name === selectedFile}>
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
                      <FormattedTime value={row.createdOn} day='numeric' month='numeric' year='numeric' />
                    </TableCell>
                  </TableRow>
                )))}
            {newFolder ?
              <TableRow key={"NewFile"} >
                <TableCell width="66px" >
                  <i className="fa fa-folder" />
                </TableCell>
                <TableCell>
                  <TextField
                    id="text-field-controlled"
                    value={folderName}
                    onChange={event => { handleNameChange(event.target.value); }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    style={{
                      marginRight: 20,
                    }}
                    onClick={(e) => { handleCreateFolder(folder.path + folderName); }}>
                    <ActionDone />
                  </Button>
                  <Button
                    style={{
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
        </Table>
      </div>
    </div>
  );
}
