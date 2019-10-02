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
  EnumCourseAction,
  ServerError,
} from '../../../model';

import {
  FileSystem,
} from '../../filesystem/';

class CourseCopyFilesModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  static propTypes = {
    copyFiles: PropTypes.func.isRequired,
    course: PropTypes.object,
    toggle: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  }

  onAccept(e) {
    e.preventDefault();

    const { course, folder } = this.props;

    this.props.copyFiles(course.id, folder.path.substring(1))
      .then(count => this.onSuccess(count))
      .catch(err => this.onError(err));
  }

  onCancel(e) {
    e.preventDefault();

    this.props.toggle();
  }

  onSuccess(count) {
    const { course: { title } } = this.props;

    toast.dismiss();

    toast.success(
      <FormattedMessage id={`course.action.${EnumCourseAction.COPY_FILES}.success`} values={{ count, title }}
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
        <FormattedMessage id={`course.action.${EnumCourseAction.COPY_FILES}.failure`} />
      );
    }
  }

  render() {
    const { loading } = this.state;
    const { course, folder = null } = this.props;

    return (
      <Modal
        centered={false}
        isOpen={this.props.visible}
        keyboard={false}
        style={{ maxWidth: '960px' }}
        toggle={this.props.toggle}>

        <div className="course-modal course-copy-files-modal">
          <a href="" className="close" onClick={(e) => this.onCancel(e)}></a>

          <div className="form-title">
            <FormattedMessage id={'course.modal.title.copy-files'} values={{ title: course.title }} />
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-content">
              <FileSystem
                header={true}
                serverButton={false}
                showFoldersOnly={true}
                upload={false}
              />
            </div>

            <section className="footer">
              <button
                type="button"
                name="action-create"
                className="action action-copy mr-4"
                disabled={!folder}
                onClick={(e) => this.onAccept(e)}>
                <i className={loading ? 'fa fa-spin fa-spinner' : 'fa fa-save'}></i>
              </button>
              <button
                type="button"
                name="action-cancel"
                className="action action-cancel"
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

export default injectIntl(CourseCopyFilesModal);
