import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { FormattedTime } from 'react-intl';
import { Row, Button } from 'reactstrap';

import decorateField from './form-field';
import formatFileSize from '../../util/file-size';
const fileColumns = [
  {
    Header: '',
    accessor: 'type',
    maxWidth: 33,
    Cell: props => props.value === 'folder' ?
      <i className="fa fa-folder" />
      : props.value === 'file' ?
        <i className="fa fa-file" />
        : <i className="fa fa-file-code" />
  },
  {
    Header: 'File Name',
    accessor: 'name',
    width: 700,
  },
  {
    Header: 'File type',
    accessor: 'type',
  },
  {
    Header: 'File Size',
    id: 'size',
    accessor: r => (r.size ? formatFileSize(r.size) : " "),
  },
  {
    Header: 'Created',
    id: 'createdOn',
    accessor: 'createdOn',
    Cell: props => (
      <FormattedTime value={props.value} day='numeric' month='numeric' year='numeric' />
    ),
    width: 150,
  },
];

export class FileSelect extends React.Component {
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
    const { style } = this.props;
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
              <Button
                color="link"
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
        <ReactTable
          //style={style}
          name={this.props.id}
          id={this.props.id}
          getTrProps={(state, rowInfo) => ({
            onClick: (e) => {
              if (rowInfo.row.type === 'file') {
                this.props.onChange(rowInfo.row);
              } else if (rowInfo.row.type === 'folder') {
                this.setState({ folder: folder.folders[rowInfo.index] });
              }
            },
            style: {
              background: this.props.value && rowInfo && rowInfo.row.type === 'file' && rowInfo.row.path === this.props.value.path ? '#20a8d8' : null,
            }
          })}
          defaultPageSize={data.length}
          showPagination={false}
          columns={fileColumns}
          data={data}
        />
      </div>
    );
  }
}

export default decorateField(FileSelect);


FileSelect.propTypes = {
  id: PropTypes.string.isRequired,
  filesystem: PropTypes.object.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};