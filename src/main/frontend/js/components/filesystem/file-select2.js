import React, { Component } from 'react';
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
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedTime } from 'react-intl';
import formatFileSize from '../../util/file-size'


/**
 * Table example 
 */
export default class FileSelect2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      folder: this.props.filesystem,
    };
  }

  _getParentDir(level) {
    let folder = this.props.filesystem;
    while (folder) {
      folder = folder.folders;
    }
    return folder;
  }

  render() {

    const { folder } = this.state;
    const data = [
      ...folder.folders.map(f => ({ ...f, type: 'folder' })),
      ...folder.files.map(f => ({ type: 'file', ...f })),
    ];
    const path = folder.path.split('/').slice(0, -1).map((name, level) => level === 0 ? ({ name: '..', folder: this.props.filesystem }) : ({ name, folder: this._getParentDir(level) }));

    return (
      <div>
        {
          path.map((item, i, arr) => (
            <span key={i}>
              <FlatButton
                style={{ margin: 12 }}
                color="#007bff"
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
        <Table height={"400px"}
          onCellClick={(e) => {
            if (data[e].type === 'file') {
            } else if (data[e].type === 'folder') {
              this.setState({ folder: folder.folders[e] });
            }
          }}>
          <TableHeader
            displaySelectAll={false}
            displayRowCheckbox={false} >
            <TableRow  >
              <TableHeaderColumn width="61px" tooltip="The ID">  </TableHeaderColumn>
              <TableHeaderColumn tooltip="File Name">File Name</TableHeaderColumn>
              <TableHeaderColumn tooltip="File type">File type</TableHeaderColumn>
              <TableHeaderColumn tooltip="File Size">File Size</TableHeaderColumn>
              <TableHeaderColumn tooltip="Last Modified">Last Modified</TableHeaderColumn>
            </TableRow>
          </TableHeader>

          {_.isEmpty(data) ?
            <TableBody displayRowCheckbox={false} >
              <TableRow>
                <TableRowColumn style={{ textAlign: 'center' }}>No Data</TableRowColumn>
              </TableRow>
            </TableBody>
            :
            <TableBody displayRowCheckbox={false} >
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableRowColumn width="61px" >{row.type === 'folder' ?
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
              ))}
            </TableBody>}
            <TableFooter adjustForCheckbox={false} >
              <TableRow/>
            </TableFooter>
        </Table>
      </div>
    );
  }
}



FileSelect2.propTypes = {
  //id: PropTypes.string.isRequired,
  filesystem: PropTypes.object.isRequired,
  //value: PropTypes.any,
  //onChange: PropTypes.func.isRequired,
};