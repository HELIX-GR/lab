import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { getFilesystem, createFolder, setTablePath, setNewFolder } from '../../ducks/filesystem';
import TableToolbar from './table-toolbar';
import FileTable from './file-table';
import { toast, } from 'react-toastify';
import { StaticRoutes, } from '../../model';
import { withRouter, } from 'react-router-dom';
import { setLoginFormVisibility } from '../../ducks/user';

/**
 * Table example 
 */
class FileSystem extends Component {
  constructor(props) {
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);

    this.state = {
      folder: this.findFolderFromPath() || this.props.filesystem,
      value_folder: "Folder Name",
      updatedAt: this.props.updatedAt,
    };
  }

  componentWillMount() {
    if (this.props.user.profile !== null) {
      this.props.getFilesystem("")
        .then(this.setState({
          folder: this.props.filesystem
        }));
    } else {
      this.props.setLoginFormVisibility(true);
      this.props.history.push(StaticRoutes.HOME);
    }

  }
  handleNameChange(value) {
    this.setState({
      value_folder: value,
    });
  }

  get selectedPath() {
    return this.props.value ? typeof this.props.value === 'object' ? this.props.value.path : this.props.value : null;
  }

  findFolderFromPath(path) {
    const currentPath = path || (this.state && this.state.folder && this.state.folder.path) || this.props.tablePath || '/';

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

  handleCreateFolder = (path) => {
    this.props.createFolder(path)
      .then(this.props.setNewFolder(false))
      .then(this.props.getFilesystem(""))
      .then(this.setState({
        value_folder: "Folder Name",
        folder: this.findFolderFromPath(this.state.folder.path),
      }));
  };


  handleRowClick = (event, index, type, name) => {
    const folder = this.findFolderFromPath();
    this.props.setTablePath(folder.path, name);

  };

  handleRowDoubleClick = (event, index, type, name) => {
    const folder = this.findFolderFromPath();

    if (type === 'file') {
      this.props.setTablePath(folder.path, name);

      if (this.props.endpoint != null) {
        window.open(this.props.endpoint + "/notebooks/" + this.props.tablePath + this.props.selectedFile, "_blank");
      }
      else {
        toast.warn(<FormattedMessage id="Toast.NoServer" defaultMessage="You need to start a Notebook Server First" />);
      }
    } else if (type === 'Folder') {
      this.setState({ folder: folder.folders[index] });
      this.props.setTablePath(folder.folders[index].path, "");
    }
  };


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
                      this.setState({ folder: item.folder });
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
    const { value_folder } = this.state;
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
        formatRelative: this.props.intl.formatRelative,
        handleCreateFolder: this.handleCreateFolder,
        setNewFolder: this.props.setNewFolder,
        folder,
        handleNameChange: this.handleNameChange,
        value_folder,
        updatedAt: this.props.updatedAt,
        selectedFile: this.props.selectedFile
      }} />
    );
  }

  render() {

    return (
      <React.Fragment>
        {this.renderHeader()}
        <div className="top-border-lab" />


        <TableToolbar />
        {this.renderBrowser()}

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
    tablePath: state.filesystem.tablePath,
    endpoint: state.server.endpoint,
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ getFilesystem, setTablePath, createFolder, setNewFolder, setLoginFormVisibility }, dispatch);


FileSystem = connect(mapStateToProps, mapDispatchToProps)(injectIntl(FileSystem));
export default withRouter(FileSystem);