import * as React from 'react';
import * as PropTypes from 'prop-types';

import { injectIntl } from 'react-intl';

import {
  Modal,
} from 'reactstrap';

import {
  FormattedMessage,
} from 'react-intl';

import StudentTable from './student-table';

class CourseStudentsModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  static propTypes = {
    addStudent: PropTypes.func.isRequired,
    course: PropTypes.object,
    getStudents: PropTypes.func.isRequired,
    removeStudent: PropTypes.func.isRequired,
    students: PropTypes.arrayOf(PropTypes.object),
    toggle: PropTypes.func.isRequired,
    updateStudent: PropTypes.func.isRequired,
    upload: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  }

  render() {
    const { course, students = null } = this.props;

    if (!students) {
      return null;
    }

    return (
      <Modal
        centered={true}
        isOpen={this.props.visible}
        keyboard={false}
        style={{ maxWidth: '960px' }}
        toggle={(e) => { e.preventDefault(); this.props.toggle(); }}>

        <div className="course-modal course-set-files-modal">
          <a href="" className="close" onClick={(e) => { e.preventDefault(); this.props.toggle(); }}></a>

          <div className="form-title">
            <FormattedMessage id={'course.modal.title.set-students'} values={{ title: course.title }} />
          </div>

          <StudentTable
            addStudent={this.props.addStudent}
            course={course}
            getStudents={this.props.getStudents}
            removeStudent={this.props.removeStudent}
            students={students}
            updateStudent={this.props.updateStudent}
            upload={this.props.upload}
          />
        </div>
      </Modal>
    );
  }
}

export default injectIntl(CourseStudentsModal);
