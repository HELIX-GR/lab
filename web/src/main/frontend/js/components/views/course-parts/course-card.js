import * as React from 'react';
import * as PropTypes from 'prop-types';

import moment from '../../../moment-localized';

import {
  FormattedMessage,
} from 'react-intl';

import {
  EnumCourseAction,
} from '../../../model';

class CourseCard extends React.Component {

  static contextTypes = {
    intl: PropTypes.object,
  };

  static defaultProps = {
    course: null,
  }

  render() {
    const { course: c, kernels } = this.props;
    const kernel = kernels.find(k => k.name === c.kernel);
    const _t = this.context.intl.formatMessage;

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
        <div className="professor pt-4 text-justify text-secondary">
          {c.professor.name} | {_t({ id: `course.enum.semester.${c.semester}` })} {c.year}
        </div>
        <div className="actions">
          <div className="action" onClick={() => this.props.handleAction(EnumCourseAction.COPY_FILES, c)}>
            <i className="fa fa-save"></i>
          </div>
          <div className="action" onClick={() => this.props.handleAction(EnumCourseAction.DELETE, c)}>
            <i className="fa fa-trash"></i>
          </div>
        </div>
        <div className="kernel">
          <a className="tag-box tag-box-other">{kernel.tag}</a>
        </div>
        <div className="date">
          <FormattedMessage id={'course.last-modified'} values={{ when: moment(c.updatedOn).fromNow() }} />
        </div>
      </div>
    );
  }

}

export default CourseCard;
