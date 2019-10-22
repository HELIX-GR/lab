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
} from '../../../model';

import {
  FileSystem,
} from '../../filesystem';

class CourseSetFolderModal extends React.Component {

  constructor(props) {
    super(props);

    const { course: { files = [] } } = props;
    const path = files.length !== 0 ? files[0] : null;

    this.state = {
      loading: false,
      path,
    };
  }

  static propTypes = {
    course: PropTypes.object,
    toggle: PropTypes.func.isRequired,
    updateCourse: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  }

  onAccept(e) {
    e.preventDefault();

    const { course, folder } = this.props;
    const path = folder.path.substring(1);

    const data = {
      ...course,
      files: [path],
    };

    this.props.updateCourse(course.id, data)
      .then(course => this.onSuccess(course, path))
      .catch(err => this.onError(err));
  }

  onCancel(e) {
    e.preventDefault();

    this.props.toggle();
  }

  onSuccess(course, path) {
    const { title } = course;

    toast.dismiss();

    toast.success(
      <FormattedMessage id={`course.action.${EnumCourseAction.SET_FILES}.success`} values={{ title, path }}
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
        <FormattedMessage id={`course.action.${EnumCourseAction.SET_FILES}.failure`} />
      );
    }
  }

  render() {
    const { loading, path } = this.state;
    const { course, folder = null } = this.props;

    return (
      <Modal
        centered={false}
        isOpen={this.props.visible}
        keyboard={false}
        style={{ maxWidth: '960px' }}
        toggle={this.props.toggle}>

        <div className="course-modal course-set-files-modal">
          <a href="" className="close" onClick={(e) => this.onCancel(e)}></a>

          <div className="form-title">
            <FormattedMessage id={'course.modal.title.set-files'} values={{ title: course.title }} />
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-content">
              <FileSystem
                defaultPath={path}
                header={true}
                serverButton={false}
                showFoldersOnly={true}
                upload={false}
              />
            </div>

            <section className="footer" style={{ position: 'inherit', paddingBottom: 10 }}>
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

export default injectIntl(CourseSetFolderModal);
