import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import ContentAdd from '@material-ui/icons/Add';
import ActionUpdate from '@material-ui/icons/Update';
import PlayArrow from '@material-ui/icons/PlayArrow';
import ServerButton from './servers-button';
import { getFilesystem, createFolder, uploadFile, setNewFolder } from '../../ducks/config';
import UploadModal from './upload-modal';

class TableToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 1,
    };
    this.handleCreate = this.handleCreate.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);

  }


  handleCreate = () => {
    this.props.setNewFolder(true);
  }
  handleRefresh = () => {
    this.props.getFilesystem("");
  }
  handleClick = () => {
    
  }

  render() {
    const style = {
      margin: 12,
    };

    return (
      <div >
        <div className="row backround-white">
          <div className="col-12 col-lg-6">

            <Button variant="fab" mini={true} style={style} onClick={this.handleCreate}>
            <img className="image-icon" src="/images/svg/SVG/add.svg" title="Add File"/>
            </Button>
            <Button variant="fab" mini={true} style={style} onClick={this.handleRefresh} >
            <img className="image-icon" src="/images/svg/SVG/refresh.svg" title="Refresh"/>
            </Button>
            <UploadModal onChange={this.props.uploadFile} />
            <Button variant="fab" mini={true} style={style} onClick={this.handleRefresh} >
            <img className="image-icon" src="/images/svg/SVG/delete.svg" title="Delete"/>
             </Button>
            {!this.props.selected_hub ?
              null
              : this.props.target ?
                <Button variant="fab" label="Play" mini={true} style={style} target="_blank" href={this.props.target + "/notebooks/" + this.props.table_path + this.props.selected_file}>
            <img className="image-icon" src="/images/svg/SVG/run.svg" title="Run"/>
                </Button> : null }
          </div>
          <div className="col-12 col-lg-6 text-lg-right">
          <ServerButton />
          </div>


        </div>
      </div>);
  }

}
TableToolbar.propTypes = {
  table_path: PropTypes.string.isRequired,
  selected_file: PropTypes.string.isRequired,
  target: PropTypes.string,
};


function mapStateToProps(state) {
  return {
    filesystem: state.config.filesystem,
    table_path: state.config.table_path,
    selected_file: state.config.selected_file,
    target: state.app.target,
    selected_hub: state.app.selected_hub,
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ getFilesystem, createFolder, uploadFile, setNewFolder }, dispatch);



export default TableToolbar = connect(mapStateToProps, mapDispatchToProps)(TableToolbar);