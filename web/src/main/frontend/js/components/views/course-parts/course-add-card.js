import * as React from 'react';

import {
  FormattedMessage,
} from 'react-intl';

import {
  EnumCourseAction,
} from '../../../model';

class CourseAddCard extends React.Component {

  render() {
    return (
      <div className="course-card placeholder">
        <div className="title"><FormattedMessage id={'course.title.create'} /></div>
        <div className="add-button" onClick={() => this.props.handleAction(EnumCourseAction.CREATE)}>
          <i className="fa fa-plus"></i>
        </div>
      </div>
    );
  }

}

export default CourseAddCard;