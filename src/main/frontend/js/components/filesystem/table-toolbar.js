import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionUpdate from 'material-ui/svg-icons/action/update';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';

import { getFilesystem, createFolder, uploadFile } from '../../ducks/config';
import UploadModal from './upload-modal';

class TableToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 1,
    };
  }

  render() {
    const style = {
      margin: 12,
    };

    return (
      <div>
        <div className="row">
          <div className="col-12 col-lg-6">
            <FloatingActionButton label="Play" mini={true} style={style}>
              <PlayArrow />
            </FloatingActionButton>
            <FloatingActionButton mini={true} style={style} >
              <ContentAdd />
            </FloatingActionButton>
            {<FloatingActionButton mini={true} style={style} onClick={this.props.onclick} >
              <ActionUpdate />
            </FloatingActionButton>}
            <UploadModal onChange={this.props.uploadFile}/>
          </div>
          <div className="col-12 col-lg-6 text-lg-right">

            <DropDownMenu value={this.state.value} onChange={(event, index, value) => this.setState({ value })}>
              <MenuItem value={1} primaryText="All Files" />
              <MenuItem value={2} primaryText="PDF" />
              <MenuItem value={3} primaryText="Python" />
              <MenuItem value={4} primaryText="R" />
              <MenuItem value={5} primaryText="Last 10 days" />
              <MenuItem value={6} primaryText="Text" />
              <MenuItem value={7} primaryText="Data" />
            </DropDownMenu>
          </div>
        </div>
      </div>);
  }

}
TableToolbar.propTypes = {
  onclick: PropTypes.func.isRequired,
};


function mapStateToProps(state) {
  return {
    filesystem: state.config.filesystem,
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ getFilesystem, createFolder, uploadFile }, dispatch);



export default TableToolbar = connect(mapStateToProps, mapDispatchToProps)(TableToolbar);