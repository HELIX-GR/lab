import React from "react";
import * as PropTypes from 'prop-types';

import { injectIntl } from 'react-intl';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { Modal } from 'reactstrap';

import CourseForm from "./course-form";

import {
  EnumCourseAction,
} from "../../../model";

class CourseEditModal extends React.Component {

  constructor(props) {
    super(props);

    const { course = null } = props;

    this.state = {
      action: course ? EnumCourseAction.UPDATE : EnumCourseAction.CREATE,
      loading: false,
    };
  }

  static propTypes = {
    addCourse: PropTypes.func.isRequired,
    course: PropTypes.object,
    toggle: PropTypes.func.isRequired,
    updateCourse: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  }

  onAccept(course) {
    const { action } = this.state;
    const id = this.props.course ? this.props.course.id : null;

    const { active, description, link, semester, title, year, kernel } = course;
    const data = {
      id,
      active,
      description,
      link,
      semester,
      title,
      year,
      kernel,
    };

    (action === EnumCourseAction.CREATE ? this.props.addCourse(data) : this.props.updateCourse(id, data))
      .then((course) => this.onSuccess(course))
      .catch((err) => this.onError(err));
  }

  onCancel(e) {
    this.props.toggle();
  }

  onSuccess(course) {
    const { action } = this.state;
    const { title } = course;

    toast.dismiss();

    toast.success(
      <FormattedMessage id={`course.action.${action}.success`} values={{ title }}
      />
    );

    this.props.toggle();
  }

  onError(err) {
    const { action } = this.state;

    if (err instanceof Error) {
      toast.error(
        <div>
          {err.errors.map((e) => (
            <p key={e.code}>{e.description}</p>
          ))}
        </div>
      );
    } else {
      toast.error(
        <FormattedMessage id={`course.action.${action}.failure`} />
      );
    }
  }

  render() {
    const { course = null, kernels, toggle, visible } = this.props;

    return (
      <Modal
        centered={true}
        isOpen={visible}
        keyboard={false}
        style={{ maxWidth: '500px' }}
        toggle={toggle}>

        <div className="course-modal course-edit-modal">
          <a href="" className="close" onClick={(e) => { e.preventDefault(); this.onCancel(e); }}></a>

          <div className="form-title">
            {course ? (
              <FormattedMessage id={'course.modal.title.update'} values={{ title: course.title }} />
            ) : (
                <FormattedMessage id={'course.modal.title.create'} />
              )}
          </div>

          <CourseForm
            course={course}
            kernels={kernels}
            onAccept={(course) => this.onAccept(course)}
            onCancel={() => this.onCancel()}
          />

        </div>
      </Modal>
    );
  }
}

export default injectIntl(CourseEditModal);
