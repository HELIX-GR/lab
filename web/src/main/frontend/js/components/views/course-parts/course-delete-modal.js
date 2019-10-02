import * as React from 'react';
import * as PropTypes from 'prop-types';

import { injectIntl } from 'react-intl';

import {
  toast,
} from 'react-toastify';

import {
  Modal,
} from 'reactstrap';

import {
  FormattedMessage,
} from 'react-intl';

import {
  ServerError, EnumCourseAction,
} from '../../../model';

class CourseDeleteModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  static propTypes = {
    course: PropTypes.object,
    removeCourse: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  }

  onAccept(e) {
    e.preventDefault();

    const { course } = this.props;

    this.props.removeCourse(course.id)
      .then(() => this.onSuccess())
      .catch((err) => this.onError(err));
  }

  onCancel(e) {
    e.preventDefault();

    this.props.toggle();
  }

  onSuccess() {
    const { course: { title } } = this.props;

    toast.dismiss();

    toast.success(
      <FormattedMessage id={`course.action.${EnumCourseAction.DELETE}.success`} values={{ title }}
      />
    );

    this.props.toggle();
  }

  onError(err) {
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
        <FormattedMessage id={`course.action.${EnumCourseAction.DELETE}.failure`} />
      );
    }
  }

  render() {
    const { loading } = this.state;
    const { course } = this.props;

    return (
      <Modal
        centered={true}
        isOpen={this.props.visible}
        keyboard={false}
        style={{ maxWidth: '500px' }}
        toggle={this.props.toggle}>

        <div className="course-modal course-delete-modal">
          <a href="" className="close" onClick={(e) => this.onCancel(e)}></a>

          <div className="form-title">
            <FormattedMessage id={'course.modal.title.delete'} />
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-content">
              <FormattedMessage id={'course.modal.message.delete'} values={{ title: course.title }} />
            </div>

            <section className="footer">
              <button
                type="button"
                name="action-create"
                className="action action-delete mr-4"
                disabled={false}
                onClick={(e) => this.onAccept(e)}>
                <i className={loading ? 'fa fa-spin fa-spinner' : 'fa fa-trash'}></i>
              </button>
              <button
                type="button"
                name="action-cancel"
                className="action action-cancel"
                disabled={false}
                onClick={(e) => this.onCancel(e)}>
                <i className="fa fa-times"></i>
              </button>
            </section>
          </form>
        </div>
      </Modal>
    );
  }
}

export default injectIntl(CourseDeleteModal);
