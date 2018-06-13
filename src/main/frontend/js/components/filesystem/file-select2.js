import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
  TableFooter,
} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedTime } from 'react-intl';
import formatFileSize from '../../util/file-size'
import { getFilesystem, createFolder, setTablePath, setNewFolder } from '../../ducks/config';
import ActionDone from 'material-ui/svg-icons/action/done';
import ContentClear from 'material-ui/svg-icons/content/clear';
import FloatingActionButton from 'material-ui/FloatingActionButton';


/**
 * Table example 
 */
class FileSelect2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      folder: this.findFolderFromPath(),
      folder: this.props.filesystem,
      value_folder: "Folder Name",
    };
  }

  componentDidMount() {
    this.setState({
      folder: this.props.filesystem,
    }
    )

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
    const hierarchy = [{ name: <i className="fas fa-home"></i>, folder: this.props.filesystem }];
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

  renderHeader() {
    const { folder } = this.state;
    const hierarchy = this.getFolderHierarchy(folder.path);

    return (
      <div className="backround-white" >
        <div className="backround-white" style={{ flexGrow: '1' }}>
          {
            hierarchy.map((item, i, arr) => (
              <span key={i}>
                <FlatButton
                  color="link"
                  onClick={(e) => {
                    if (item && item.folder) {
                      this.setState({ folder: item.folder });
                    }
                  }}
                >
                  {item.name}
                </FlatButton>
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
      ...folder.folders.map(f => ({ ...f, type: 'folder' })),
      ...folder.files.map(f => ({ ...f, type: 'file' })),
    ];
    this.props.setTablePath(folder.path, "");
    return (
      <div className="filesystem-box">
        {this.renderHeader()}

        <Table height={"400px"}
          onCellClick={(e) => {
            if (data[e] && data[e].type === 'file') {
              this.props.setTablePath(folder.path, data[e].name);
            } else if (data[e] && data[e].type === 'folder') {
              this.setState({ folder: folder.folders[e] });
            }
          }}>
          <TableHeader
            displaySelectAll={false}
            displayRowCheckbox={false} >
            <TableRow  >
              <TableHeaderColumn width="66px" tooltip="The ID">  </TableHeaderColumn>
              <TableHeaderColumn tooltip="File Name">File Name</TableHeaderColumn>
              <TableHeaderColumn tooltip="File type">File type</TableHeaderColumn>
              <TableHeaderColumn tooltip="File Size">File Size</TableHeaderColumn>
              <TableHeaderColumn tooltip="Last Modified">Last Modified</TableHeaderColumn>
            </TableRow>
          </TableHeader>

          <TableBody displayRowCheckbox={false} >
            {(_.isEmpty(data) && !this.props.new_folder) ?
              <TableRow>
                <TableRowColumn style={{ textAlign: 'center' }}>No Data</TableRowColumn>
              </TableRow>
              : (data.map((row, index) => (
                <TableRow key={index}>
                  <TableRowColumn width="66px" >{row.type === 'folder' ?
                    <i className="fa fa-folder" />
                    : row.type === 'file' ?
                      <i className="fa fa-file" />
                      : <i className="fa fa-file-code" />}
                  </TableRowColumn>
                  <TableRowColumn>{row.name}</TableRowColumn>
                  <TableRowColumn>{row.type}</TableRowColumn>
                  <TableRowColumn>{formatFileSize(row.size)}</TableRowColumn>
                  <TableRowColumn>
                    <FormattedTime value={row.createdOn} day='numeric' month='numeric' year='numeric' />
                  </TableRowColumn>
                </TableRow>
              )))}
            {this.props.new_folder ?
              <TableRow key={"NewFile"} >
                <TableRowColumn width="66px" >
                  <i className="fa fa-folder" />
                </TableRowColumn>
                <TableRowColumn>
                  <TextField
                    id="text-field-controlled"
                    value={this.state.value_folder}
                    onChange={this.handleNameChange}
                  />
                </TableRowColumn>
                <TableRowColumn>
                  <FloatingActionButton mini={true} secondary={true} style={{
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
                  </FloatingActionButton>
                  <FloatingActionButton mini={true} secondary={true} style={{
                    marginRight: 20,
                  }}
                    onClick={(e) => {
                      this.props.setNewFolder(false);
                    }} >
                    <ContentClear />
                  </FloatingActionButton>
                </TableRowColumn>
                <TableRowColumn> </TableRowColumn>
                <TableRowColumn>  </TableRowColumn>
              </TableRow>
              : null
            }
          </TableBody>
          <TableFooter adjustForCheckbox={false} >
            <TableRow />
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
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ getFilesystem, setTablePath, createFolder, setNewFolder }, dispatch);



export default FileSelect2 = connect(mapStateToProps, mapDispatchToProps)(FileSelect2);