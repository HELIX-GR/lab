import studentCourseService from '../service/course-student';

// Actions

const COURSES_REQUEST = 'course/student/COURSES_REQUEST';
const COURSES_RESPONSE = 'course/student/COURSES_RESPONSE';
const REMOVE_COURSE_REQUEST = 'course/student/REMOVE_COURSE_REQUEST';
const REMOVE_COURSE_SUCCESS = 'course/student/REMOVE_COURSE_SUCCESS';
const COPY_COURSE_FILES_REQUEST = 'course/student/COPY_COURSE_FILES_REQUEST';
const COPY_COURSE_FILES_RESPONSE = 'course/student/COPY_COURSE_FILES_RESPONSE';

// Reducer

const initialState = {
  courses: [],
  selected: null,
};

export default (state = initialState, action) => {
  switch (action.type) {

    case COURSES_RESPONSE:
      return {
        ...state,
        courses: action.courses,
        selected: null,
      };

    case REMOVE_COURSE_SUCCESS:
      return {
        ...state,
        courses: state.courses.filter(c => c.id != action.id),
      };

    default:
      return state;
  }
};

// Action Creators

const getCoursesRequest = () => ({
  type: COURSES_REQUEST,
});

const getCoursesResponse = (courses) => ({
  type: COURSES_RESPONSE,
  courses,
});

const removeCourseRequest = () => ({
  type: REMOVE_COURSE_REQUEST,
});

const removeCourseResponse = (id) => ({
  type: REMOVE_COURSE_SUCCESS,
  id,
});

const copyFilesRequest = () => ({
  type: COPY_COURSE_FILES_REQUEST,
});

const copyFilesResponse = () => ({
  type: COPY_COURSE_FILES_RESPONSE,
});

// Thunk actions

export const getCourses = () => (dispatch, getState) => {
  dispatch(getCoursesRequest());

  return studentCourseService.getCourses()
    .then(courses => {
      dispatch(getCoursesResponse(courses));

      return courses;
    });
};

export const removeCourse = (id) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  dispatch(removeCourseRequest());

  return studentCourseService.removeCourse(id, token)
    .then(() => {
      dispatch(removeCourseResponse(id));
    });
};

export const copyCourseFiles = (id, target) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  dispatch(copyFilesRequest());

  return studentCourseService.copyCourseFiles(id, target, token)
    .then(count => {
      dispatch(copyFilesResponse());

      return count;
    });
};
