import * as React from 'react';
import * as PropTypes from 'prop-types';

import moment from '../../../moment-localized';

import {
  FormattedMessage,
} from 'react-intl';

import {
  EnumCourseAction,
} from '../../../model';

class CourseAdminCard extends React.Component {

  static contextTypes = {
    intl: PropTypes.object,
  };

  static defaultProps = {
    course: null,
  }

  render() {
    const { course: c = null } = this.props;
    const _t = this.context.intl.formatMessage;

    return (
      <div className="course-card course-card-admin">
        <div className="title">
          {c.link ? (
            <a href={c.link} target="_blank">{c.title}</a>
          ) : (
              <a>{c.title}</a>
            )}
        </div>
        <div className="description pt-4 text-justify text-secondary">
          {_t({ id: `course.enum.semester.${c.semester}` })} {c.year}
        </div>
        <div className="actions">
          <div className="action action-edit" onClick={() => this.props.handleAction(EnumCourseAction.UPDATE, c)}>
            <i className="fa fa-pencil"></i>
          </div>
          <div className="action action-users" onClick={() => this.props.handleAction(EnumCourseAction.SET_STUDENTS, c)}>
            <i className="fa fa-users"></i>
          </div>
          <div className="action action-set-files" onClick={() => this.props.handleAction(EnumCourseAction.SET_FILES, c)}>
            <i className="fa fa-folder-open-o"></i>
          </div>
          <div className="action action-delete" onClick={() => this.props.handleAction(EnumCourseAction.DELETE, c)}>
            <i className="fa fa-trash"></i>
          </div>
        </div>
        <div className="date">
          <FormattedMessage id={'course.last-modified'} values={{ when: moment(c.updatedOn).fromNow() }} />
        </div>
      </div>
    );
  }

}

export default CourseAdminCard;