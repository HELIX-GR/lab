import React from 'react';
import * as PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 18px',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    flex: '1 1 100%'
  },
  helperText: {
    marginLeft: 8,
    fontSize: 10,
  },
  menu: {
    width: 200,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '10px 0px',
  }
});

class CourseForm extends React.Component {

  constructor(props) {
    super(props);

    const { course = null } = props;

    this.state = {
      course: course ? ({
        ...course,
      }) : ({
        title: '',
        description: '',
        year: (new Date()).getFullYear(),
        semester: 'FALL',
        link: '',
        active: false,
      }),
      errors: {

      },
    };

    this.inputRef = React.createRef();
  }

  static contextTypes = {
    intl: PropTypes.object,
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    course: PropTypes.object,
    onAccept: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { course } = this.state;

    let errors = {};
    Object.keys(course).forEach(key => {
      errors = {
        ...errors,
        ...this.validate(key, course[key]),
      };
    });

    this.setState({ errors });

    this.inputRef.current.focus();
  }

  get isModified() {
    const { course: initial = null } = this.props;
    const { course: current } = this.state;

    if (!initial) {
      return true;
    }

    return Object.keys(current).some(key => current[key] !== initial[key]);
  }

  setValue(property, value) {
    const { [property]: key, ...rest } = this.state.errors;

    const error = this.validate(property, value);

    this.setState(state => ({
      course: {
        ...state.course,
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
      case 'description':
      case 'title':
        return value ? {} : { [property]: _t({ id: 'course.validation.required' }) };

      case 'link': {
        const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/gi;

        return !value || regex.test(value) ? {} : { [property]: _t({ id: 'course.validation.invalid' }) };
      }

      default:
        return {};
    }
  }

  render() {
    const { course, errors } = this.state;
    const { classes } = this.props;
    const now = new Date();
    const years = [now.getFullYear(), now.getFullYear() + 1];
    const _t = this.context.intl.formatMessage;

    return (
      <React.Fragment>
        <form className={classes.container} noValidate autoComplete="off">
          <div className="mb-4">
            <TextField
              id="title"
              name="title"
              className={classes.textField}
              label={_t({ id: 'course.form.title' })}
              defaultValue={course.title}
              onChange={(e) => this.setValue(e.target.id, e.target.value)}
              fullWidth={true}
              error={!!errors['title']}
              inputRef={this.inputRef}
              autoFocus={true}
            />
            {errors['title'] &&
              <FormHelperText id="title" className={classes.helperText}>{errors['title']}</FormHelperText>
            }
          </div>
          <div className="mb-4">
            <TextField
              id="description"
              name="description"
              className={classes.textField}
              label={_t({ id: 'course.form.description' })}
              defaultValue={course.description}
              onChange={(e) => this.setValue(e.target.id, e.target.value)}
              multiline
              rowsMax="4"
              fullWidth={true}
              error={!!errors['description']}
            />
            {errors['description'] &&
              <FormHelperText id="description" className={classes.helperText}>{errors['description']}</FormHelperText>
            }
          </div>
          <div className="mb-4 d-flex">
            <div>
              <TextField
                id="year"
                name="year"
                className={classes.textField}
                select
                label={_t({ id: 'course.form.year' })}
                value={course.year || years[0]}
                onChange={(e) => this.setValue(e.target.name, e.target.value)}
              >
                <MenuItem key={years[0]} value={years[0]}>{years[0]}</MenuItem>
                <MenuItem key={years[1]} value={years[1]}>{years[1]}</MenuItem>
              </TextField>
            </div>
            <div>
              <TextField
                id="semester"
                name="semester"
                className={classes.textField}
                select
                label={_t({ id: 'course.form.semester' })}
                value={course.semester || 'FALL'}
                onChange={(e) => this.setValue(e.target.name, e.target.value)}
              >
                <MenuItem key={'FALL'} value={'FALL'}><FormattedMessage id="course.enum.semester.FALL" /></MenuItem>
                <MenuItem key={'SPRING'} value={'SPRING'}><FormattedMessage id="course.enum.semester.SPRING" /></MenuItem>
              </TextField>
            </div>
          </div>
          <div className="mb-4">
            <TextField
              id="link"
              name="link"
              className={classes.textField}
              label={_t({ id: 'course.form.link' })}
              defaultValue={course.link}
              onChange={(e) => this.setValue(e.target.id, e.target.value)}
              fullWidth={true}
              error={!!errors['link']}
            />
            {errors['link'] &&
              <FormHelperText id="link" className={classes.helperText}>{errors['link']}</FormHelperText>
            }
          </div>
          <div className="mb-4 pl-2">
            <FormControlLabel
              control={
                <Checkbox
                  id="active"
                  checked={course.active}
                  onChange={(e, checked) => this.setValue(e.target.id, checked)}
                  color="primary"
                />
              }
              label={_t({ id: 'course.form.active' })}
            />
          </div>
        </form>

        <div className={classes.toolbar}>
          <Button
            className="mr-2"
            onClick={() => this.props.onCancel()}>
            <FormattedMessage id="course.button.cancel" />
          </Button>
          <Button
            className="mr-2"
            color="primary"
            disabled={Object.keys(errors).length !== 0 || !this.isModified}
            onClick={() => this.props.onAccept(this.state.course)}>
            <FormattedMessage id="course.button.save" />
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(CourseForm);
