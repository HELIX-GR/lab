import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FormattedMessage, injectIntl } from 'react-intl';

import {
  StaticRoutes,
} from '../../model';

import TableToolbar from './table-toolbar';
import FileTable from './file-table';

import {
  createFolder,
  getFileSystem,
  setNewFolder,
  setPath,
} from '../../ducks/filesystem';

class FileSystem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      folder: this.props.filesystem,
      folderName: 'Folder Name',
      updatedAt: this.props.updatedAt,
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleRowDoubleClick = this.handleRowDoubleClick.bind(this);
    this.handleCreateFolder = this.handleCreateFolder.bind(this);
  }

  static defaultProps = {
    showFoldersOnly: false,
  }

  get selectedPath() {
    return this.props.value ? typeof this.props.value === 'object' ? this.props.value.path : this.props.value : null;
  }

  componentWillMount() {
    if (this.props.user.profile !== null) {
      this.props.getFileSystem('')
        .then(() => {
          const { defaultPath = null, filesystem } = this.props;

          this.setState({
            folder: filesystem
          });

          if (defaultPath) {
            let folder = filesystem;

            defaultPath.split('/').slice(0, -2).forEach((name) => {
              if (name) {
                folder = folder.folders.find((f) => f.name === name);
              }
            });

            this.props.setPath(folder, defaultPath.split('/').slice(0, -1).reverse()[0]);
          }
        });
    } else {
      this.props.history.push(StaticRoutes.HOME);
    }

  }

  handleNameChange(value) {
    this.setState({
      folderName: value,
    });
  }

  findFolderFromPath(path = null) {
    const currentPath = path || (this.state && this.state.folder && this.state.folder.path) || this.props.defaultPath || '/';

    let folder = this.props.filesystem;

    currentPath.split('/').slice(0, -1).forEach((name) => {
      if (name) {
        folder = folder.folders.find((f) => f.name === name);
      }
    });

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

  handleCreateFolder(path) {
    toast.dismiss();

    this.props.createFolder(path)
      .then(() => {
        this.props.setNewFolder(false);

        this.setState({
          folderName: "Folder Name",
          folder: this.findFolderFromPath(this.state.folder.path),
        });
      })
      .catch(err => {
        toast.error(err.errors[0].description);
      });
  }

  handleRowClick(event, index, type, name) {
    const folder = this.findFolderFromPath();

    this.props.setPath(folder, name);
  }

  handleRowDoubleClick(event, index, type, name) {
    const folder = this.findFolderFromPath();

    if (type === 'file') {
      this.props.setPath(folder, name);

      if (this.props.endpoint != null) {
        window.open(this.props.endpoint + "/notebooks/" + this.props.path + this.props.selectedFile, "_blank");
      }
      else {
        toast.warn(<FormattedMessage id="error.file-system.no-server-selected" />);
      }
    } else if (type === 'Folder') {
      this.setState({ folder: folder.folders[index] });
      this.props.setPath(folder.folders[index], "");
    }
  }

  setFolderFromBreadcrumb(item) {
    this.setState({
      folder: item.folder
    }, () => {
      const folder = this.findFolderFromPath();
      this.props.setPath(item.folder, item.folder.name);
    });
  }

  renderHeader() {
    const folder = this.findFolderFromPath();
    const hierarchy = this.getFolderHierarchy(folder.path);

    return (
      <div className="row">
        <div className="col">
          <div className="breadcrumbs-pagination " >
            <div className="breadcrumbs">

              {hierarchy.map((item, i, arr) => (
                <a
                  key={i}
                  onClick={(e) => {
                    if (item && item.folder) {
                      this.setFolderFromBreadcrumb(item);
                    }
                  }}
                  className="breadcrumbs-part">{item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderBrowser() {
    const { folderName } = this.state;
    const folder = this.findFolderFromPath();

    return (
      <FileTable props={{
        data: [
          ...folder.folders,
          ...folder.files,
        ],
        newFolder: this.props.newFolder,
        handleRowClick: this.handleRowClick,
        handleRowDoubleClick: this.handleRowDoubleClick,
        handleCreateFolder: this.handleCreateFolder,
        setNewFolder: this.props.setNewFolder,
        folder,
        handleNameChange: this.handleNameChange,
        folderName,
        updatedAt: this.props.updatedAt,
        selectedFile: this.props.selectedFile,
        showFoldersOnly: this.props.showFoldersOnly,
      }} />
    );
  }

  render() {
    const { header = true, serverButton = true, upload = true } = this.props;
    const folder = this.findFolderFromPath();

    if (!folder) {
      return null;
    }

    return (
      <React.Fragment>
        {header && this.renderHeader()}
        <div className="top-border-lab" />

        <div className="background-white mb-5">
          <TableToolbar
            serverButton={serverButton}
            upload={upload}
          />
          {this.renderBrowser()}
        </div>

      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    filesystem: state.filesystem.data,
    newFolder: state.filesystem.newFolder,
    updatedAt: state.filesystem.updatedAt,
    selectedFile: state.filesystem.selectedFile,
    user: state.user,
    path: state.filesystem.path,
    endpoint: state.server.endpoint,
  };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createFolder,

  getFileSystem,
  setNewFolder,
  setPath,
}, dispatch);

FileSystem = connect(mapStateToProps, mapDispatchToProps)(injectIntl(FileSystem));

export default withRouter(FileSystem);