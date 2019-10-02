import * as React from 'react';

import moment from '../../../moment-localized';

import {
  FormattedMessage,
} from 'react-intl';

import {
  EnumCourseAction,
} from '../../../model';

class CourseCard extends React.Component {

  static defaultProps = {
    course: null,
  }

  render() {
    const { course: c = null } = this.props;

    return (
      <div className="course-card">
        <div className="title">
          {c.link ? (
            <a href={c.link} target="_blank">{c.title}</a>
          ) : (
            <a>{c.title}</a>
          )}
        </div>
        <div className="description pt-4 text-justify text-secondary">
          {c.description}
        </div>
        <div className="description pt-4 text-justify text-secondary">
          {c.semester} {c.year}
        </div>
        <div className="actions">
          <div className="action" onClick={() => this.props.handleAction(EnumCourseAction.COPY_FILES, c)}>
            <i className="fa fa-save"></i>
          </div>
          <div className="action" onClick={() => this.props.handleAction(EnumCourseAction.DELETE, c)}>
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

export default CourseCard;
