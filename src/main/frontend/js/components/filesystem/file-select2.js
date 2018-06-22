import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import _ from 'lodash';
import { FormattedTime, injectIntl } from 'react-intl';
import formatFileSize from '../../util/file-size';
import { getFilesystem, createFolder, setTablePath, setNewFolder } from '../../ducks/config';
import ActionDone from '@material-ui/icons/Done';
import ContentClear from '@material-ui/icons/Clear';


/**
 * Table example 
 */
class FileSelect2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      folder: this.props.filesystem || this.findFolderFromPath(),
      value_folder: "Folder Name",
    };
  }

  componentDidMount() {
    this.setState({
      folder: this.props.filesystem,
    }
    );
  }

  get selectedPath() {
    return this.props.value ? typeof this.props.value === 'object' ? this.props.value.path : this.props.value : null;
  }

  findFolderFromPath(path) {
    const currentPath = path || this.selectedPath || (this.state && this.state.folder && this.state.folder.path) || '/';

    let folder = this.props.filesystem;

    currentPath.split('/').slice(0, -1).forEach((name) => {
      if (name) {
        folder = folder.folders.find((f) => f.name === name);
      }
    });

    return folder;
  }


  _getParentDir(level) {
    let folder = this.props.filesystem;
    while (folder) {
      folder = folder.folders;
    }
    return folder;
  }

  getFolderHierarchy(path) {
    const hierarchy = [{ name: <i className="fa fa-home fa-lg"></i>, folder: this.props.filesystem }];
    let currentFolder = this.props.filesystem;

    path.split('/').slice(0, -1).forEach((name) => {
      if (name) {
        currentFolder = currentFolder.folders.find((f) => f.name === name);
        hierarchy.push({ name, folder: currentFolder });
      }
    });

    return hierarchy;
  }

  handleNameChange = (event) => {
    this.setState({
      value_folder: event.target.value,
    });
  };


  handleRowClick = (event, index, type, name) => {

    const { folder } = this.state;

    if (type === 'File') {
      this.props.setTablePath(folder.path, name);
    } else if (type === 'Folder') {
      this.setState({ folder: folder.folders[index] });
    }
  };

  renderHeader() {
    const { folder } = this.state;
    const hierarchy = this.getFolderHierarchy(folder.path);

    return (
      <div className="backround-white" >
        <div className="backround-white" style={{ flexGrow: '1' }}>
          {
            hierarchy.map((item, i, arr) => (
              <span key={i}>
                <Button
                  onClick={(e) => {
                    if (item && item.folder) {
                      this.setState({ folder: item.folder });
                    }
                  }}
                >
                  {item.name}
                </Button>
                {i !== arr.length - 1 ? <span>/</span> : null}
              </span>
            ))
          }
        </div>
      </div>
    );
  }

  render() {

    const { folder } = this.state;
    const data = [
      ...folder.folders,
      ...folder.files,
    ];
    this.props.setTablePath(folder.path, "");
    return (
      <div className="filesystem-box">
        {this.renderHeader()}

        <Table >
          <TableHead>
            <TableRow  >
              <TableCell width="66px" tooltip="The ID">  </TableCell>
              <TableCell tooltip="File Name">File Name</TableCell>
              <TableCell tooltip="File type">File type</TableCell>
              <TableCell tooltip="File Size">File Size</TableCell>
              <TableCell tooltip="Last Modified">Last Modified</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(_.isEmpty(data) && !this.props.new_folder) ?
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
                  onClick={event => this.handleRowClick(event, index, row.type, row.name)}
                  key={index}>
                  <TableCell width="66px" >{row.type === 'Folder' ?
                    <i className="fa fa-folder" />
                    : row.type === 'File' ?
                      <i className="fa fa-file" />
                      : <i className="fa fa-file-code" />}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{formatFileSize(row.size)}</TableCell>
                  <TableCell>
                  {this.props.intl.formatRelative(row.createdOn)}
                  </TableCell>
                </TableRow>
              )))}
            {this.props.new_folder ?
              <TableRow key={"NewFile"} >
                <TableCell width="66px" >
                  <i className="fa fa-folder" />
                </TableCell>
                <TableCell>
                  <TextField
                    id="text-field-controlled"
                    value={this.state.value_folder}
                    onChange={this.handleNameChange}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="fab" mini={true} secondary={true} style={{
                    marginRight: 20,
                  }} onClick={(e) => {
                    this.props.createFolder(folder.path + this.state.value_folder)
                      .then(this.props.setNewFolder(false))
                      .then(this.props.getFilesystem(""))
                      .then(this.setState({
                        value_folder: "Folder Name",
                        folder: this.findFolderFromPath(folder.path),
                      }));
                  }} >
                    <ActionDone />
                  </Button>
                  <Button variant="fab" mini={true} secondary={true} style={{
                    marginRight: 20,
                  }}
                    onClick={(e) => {
                      this.props.setNewFolder(false);
                    }} >
                    <ContentClear />
                  </Button>
                </TableCell>
              </TableRow>
              : null
            }
          </TableBody>
          <TableFooter >
            <TableCell />
            <TableCell width="300px">
            {this.props.intl.formatRelative(this.props.last_update)}
            </TableCell>
          </TableFooter>
        </Table>
      </div>
    );
  }
}




function mapStateToProps(state) {
  return {
    filesystem: state.config.filesystem,
    new_folder: state.config.new_folder,
    last_update: state.config.last_updated,
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ getFilesystem, setTablePath, createFolder, setNewFolder }, dispatch);



export default FileSelect2 = connect(mapStateToProps, mapDispatchToProps)(injectIntl(FileSelect2));