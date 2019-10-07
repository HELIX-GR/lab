import React from 'react';
import * as PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';

import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';

const MB = 1048576;

const styles = (theme) => ({
  textField: {
    paddingRight: 10,
  },
  helperText: {
    marginLeft: 8,
    fontSize: 10,
  },
});

class StudentTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      createRegistration: false,
      deleteRegistration: null,
      editRegistration: null,
      page: 0,
      rowsPerPage: 5,
      values: null,
      errors: {},
    };
  }

  static contextTypes = {
    intl: PropTypes.object,
  };

  static propTypes = {
    addStudent: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    course: PropTypes.object.isRequired,
    getStudents: PropTypes.func.isRequired,
    removeStudent: PropTypes.func.isRequired,
    students: PropTypes.arrayOf(PropTypes.object).isRequired,
    updateStudent: PropTypes.func.isRequired,
    upload: PropTypes.func.isRequired,
  }

  openFileDialog(e) {
    e.preventDefault();

    this._fileInput.click();
  }

  onFileChange(e) {
    e.preventDefault();

    toast.dismiss();

    const files = this._fileInput.files;

    if (files.length !== 1) {
      return;
    }

    const file = files[0];

    if (file.size > 5 * MB) {
      toast.error(<FormattedMessage id="course.error.filesystem.size.less-than" values={{ size: '5MB' }} />);
      return;
    }

    if (!file.type.startsWith('text/plain')) {
      toast.error(<FormattedMessage id="course.error.filesystem.type-not-supported" />);
      return;
    }

    this.props.upload(this.props.course, file)
      .then(() => {
        this._fileInput.value = null;
      });
  }

  onChangePage(e, page) {
    this.setState({
      page,
    });
  }

  onCreate(e) {
    e.preventDefault();

    const values = {
      email: '',
      firstName: '',
      lastName: '',
    };

    let errors = {};
    Object.keys(values).forEach(key => {
      errors = {
        ...errors,
        ...this.validate(key, values[key]),
      };
    });

    this.setState({
      createRegistration: true,
      values,
      errors,
    });
  }

  onEdit(registration) {
    const values = {
      email: registration.student.email,
      firstName: registration.student.firstName,
      lastName: registration.student.lastName,
    };

    let errors = {};
    Object.keys(values).forEach(key => {
      errors = {
        ...errors,
        ...this.validate(key, values[key]),
      };
    });

    this.setState({
      editRegistration: registration,
      values,
      errors,
    });
  }

  onPropertyChange(property, value) {
    const { [property]: key, ...rest } = this.state.errors;

    const error = this.validate(property, value);

    this.setState(state => ({
      values: {
        ...state.values,
        [property]: value,
      },
      errors: {
        ...rest,
        ...error,
      }
    }));
  }

  validate(property, value) {
    const _t = this.context.intl.formatMessage;

    switch (property) {
      case 'email':
      case 'firstName':
      case 'lastName':
        return value ? {} : { [property]: _t({ id: 'course.validation.required' }) };

      default:
        return {};
    }
  }

  onCreateConfirm(courseId, values) {
    this.props.addStudent(courseId, values)
      .then(() => {
        this.setState({
          createRegistration: false,
          values: null,
          errors: {},
        });
      });
  }

  onCreateReject() {
    this.setState({
      createRegistration: false,
      values: null,
      errors: {},
    });
  }

  onEditConfirm(courseId, registrationId, values) {
    this.props.updateStudent(courseId, registrationId, values)
      .then(() => {
        this.setState({
          editRegistration: null,
          values: null,
          errors: {},
        });
      });
  }

  onEditReject() {
    this.setState({
      editRegistration: null,
      values: null,
      errors: {},
    });
  }

  onRemove(registration) {
    this.setState({
      deleteRegistration: registration,
    });
  }

  onRemoveConfirm(courseId, registrationId) {
    this.props.removeStudent(courseId, registrationId)
      .finally(() => {
        this.setState({ deleteRegistration: null });
      });
  }

  onRemoveReject() {
    this.setState({ deleteRegistration: null });
  }

  onRefresh(e) {
    e.preventDefault();

    this.props.getStudents();
  }

  renderNoData() {
    return (
      <TableRow>
        <TableCell className="p-0" colSpan={4} style={{ textAlign: 'center' }}> No Data </TableCell>
      </TableRow>
    );
  }

  renderNewRow() {
    const { values, errors } = this.state;
    const { classes, course } = this.props;

    return (
      <TableRow>
        <TableCell className="p-0" width="100px" >
          <Button
            style={{ minWidth: 20, width: 40, borderRadius: 30 }}
            variant="flat"
            disabled={Object.keys(errors).length !== 0}
            onClick={() => this.onCreateConfirm(course.id, values)}
          >
            <DoneIcon />
          </Button>
          <Button
            style={{ minWidth: 20, width: 40, borderRadius: 30 }}
            variant="flat"
            onClick={() => this.onCreateReject()}
          >
            <ClearIcon />
          </Button>
        </TableCell>
        <TableCell className="p-0">
          <TextField
            id="email"
            name="email"
            className={classes.textField}
            defaultValue={values.email}
            fullWidth={true}
            error={!!errors['email']}
            onChange={event => { this.onPropertyChange(event.target.id, event.target.value); }}
          />
        </TableCell>
        <TableCell className="p-0">
          <TextField
            id="firstName"
            name="firstName"
            className={classes.textField}
            defaultValue={values.firstName}
            fullWidth={true}
            error={!!errors['firstName']}
            onChange={event => { this.onPropertyChange(event.target.id, event.target.value); }}
          />
        </TableCell>
        <TableCell className="p-0">
          <TextField
            id="lastName"
            name="lastName"
            className={classes.textField}
            defaultValue={values.lastName}
            fullWidth={true}
            error={!!errors['lastName']}
            onChange={event => { this.onPropertyChange(event.target.id, event.target.value); }}
          />
        </TableCell>
      </TableRow>
    );
  }

  renderStudentRows(pageIndex, pageSize) {
    const { createRegistration, editRegistration, deleteRegistration = null, values, errors } = this.state;
    const { classes, course, students: registrations = [] } = this.props;

    return registrations
      .slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
      .map(r => (
        <TableRow
          hover
          key={r.id}>
          {deleteRegistration && deleteRegistration.id === r.id &&
            <React.Fragment>
              <TableCell className="p-0" width="100px" >
                <Button
                  style={{ minWidth: 20, width: 40, borderRadius: 30 }}
                  variant="flat"
                  onClick={() => this.onRemoveConfirm(course.id, r.id)}
                >
                  <DoneIcon />
                </Button>
                <Button
                  style={{ minWidth: 20, width: 40, borderRadius: 30 }}
                  variant="flat"
                  onClick={() => this.onRemoveReject()}
                >
                  <ClearIcon />
                </Button>
              </TableCell>
              <TableCell colSpan={3} className="p-0">
                <FormattedMessage id="student.message.delete.confirm" values={{ email: r.student.email }} />
              </TableCell>
            </React.Fragment>
          }
          {editRegistration && editRegistration.id === r.id &&
            <React.Fragment>
              <TableCell className="p-0" width="100px" >
                {!deleteRegistration &&
                  <React.Fragment>
                    <Button
                      style={{ minWidth: 20, width: 40, borderRadius: 30 }}
                      variant="flat"
                      disabled={Object.keys(errors).length !== 0}
                      onClick={() => this.onEditConfirm(course.id, r.id, values)}
                    >
                      <DoneIcon />
                    </Button>
                    <Button
                      style={{ minWidth: 20, width: 40, borderRadius: 30 }}
                      variant="flat"
                      onClick={() => this.onEditReject()}
                    >
                      <ClearIcon />
                    </Button>
                  </React.Fragment>
                }
              </TableCell>
              <TableCell className="p-0">
                {r.student.email}
              </TableCell>
              <TableCell className="p-0">
                <TextField
                  id="firstName"
                  name="firstName"
                  className={classes.textField}
                  defaultValue={values.firstName}
                  fullWidth={true}
                  error={!!errors['firstName']}
                  onChange={event => { this.onPropertyChange(event.target.id, event.target.value); }}
                />
              </TableCell>
              <TableCell className="p-0">
                <TextField
                  id="lastName"
                  name="lastName"
                  className={classes.textField}
                  defaultValue={values.lastName}
                  fullWidth={true}
                  error={!!errors['lastName']}
                  onChange={event => { this.onPropertyChange(event.target.id, event.target.value); }}
                />
              </TableCell>
            </React.Fragment>
          }
          {(!editRegistration || editRegistration.id !== r.id) && (!deleteRegistration || deleteRegistration.id !== r.id) &&
            <React.Fragment>
              <TableCell className="p-0" width="100px" >
                {!createRegistration && !deleteRegistration && !editRegistration &&
                  <React.Fragment>
                    <Button
                      style={{ minWidth: 20, width: 40, borderRadius: 30 }}
                      variant="flat"
                      onClick={() => this.onEdit(r)}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      style={{ minWidth: 20, width: 40, borderRadius: 30 }}
                      variant="flat"
                      onClick={() => this.onRemove(r)}
                    >
                      <DeleteIcon />
                    </Button>
                  </React.Fragment>
                }
              </TableCell>
              <TableCell className="p-0">{r.student.email}</TableCell>
              <TableCell className="p-0">{r.student.firstName}</TableCell>
              <TableCell className="p-0">{r.student.lastName}</TableCell>
            </React.Fragment>
          }
        </TableRow>
      ));
  }

  render() {
    const {
      createRegistration,
      editRegistration,
      deleteRegistration,
      page,
      rowsPerPage,
    } = this.state;

    const {
      students = [],
    } = this.props;

    return (
      <React.Fragment>

        <div className="d-none">
          <input ref={(el) => this._fileInput = el} type="file" onChange={(e) => this.onFileChange(e)} name="file" />
        </div>

        <div className="d-flex flex-column">
          <div style={{ marginLeft: 10 }}>
            <div className="filesystem-btn">
              <a href="" onClick={(e) => this.onCreate(e)}>
                <img src="/images/svg/SVG/add.svg" />
              </a>
            </div>
            {!createRegistration && !editRegistration && !deleteRegistration &&
              <React.Fragment>
                <div className="toolbar-btn">
                  <a href="" onClick={(e) => this.openFileDialog(e)}>
                    <img src="/images/svg/SVG/upload.svg" />
                  </a>
                </div>

                <div className="filesystem-btn">
                  <a onClick={(e) => this.onRefresh(e)}>
                    <img src="/images/svg/SVG/refresh.svg" /></a>
                </div>
              </React.Fragment>
            }
          </div>

          <div className="table-wrapper">
            <Table >
              <TableHead>
                <TableRow  >
                  <TableCell className="p-0" width="100px">
                  </TableCell>
                  <TableCell className="p-0"><FormattedMessage id="student.table.email" /></TableCell>
                  <TableCell className="p-0"><FormattedMessage id="student.table.firstName" /></TableCell>
                  <TableCell className="p-0"><FormattedMessage id="student.table.lastName" /></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {createRegistration &&
                  this.renderNewRow()
                }
                {students.length === 0 ? (
                  this.renderNoData()
                ) : (
                  this.renderStudentRows(page, rowsPerPage)
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              rowsPerPageOptions={[5]}
              count={students.length}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                'aria-label': 'previous page',
              }}
              nextIconButtonProps={{
                'aria-label': 'next page',
              }}
              labelRowsPerPage="Εγγραφές ανά σελίδα"
              labelDisplayedRows={({ from, to, count }) => `${from} - ${to} από ${count}`}
              onChangePage={(e, page) => this.onChangePage(e, page)}
            />
          </div>
        </div>

      </React.Fragment>
    );
  }
}

export default withStyles(styles)(StudentTable);
