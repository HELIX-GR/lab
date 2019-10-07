import _ from 'lodash';

import professorCourseService from '../service/course-professor';

// Actions

const SET_SELECTED_COURSE = 'course/professor/SET_SELECTED_COURSE';
const SET_SELECTED_STUDENT = 'course/professor/SET_SELECTED_STUDENT';

const COURSES_REQUEST = 'course/professor/COURSES_REQUEST';
const COURSES_RESPONSE = 'course/professor/COURSES_RESPONSE';
const ADD_COURSE_REQUEST = 'course/professor/ADD_COURSE_REQUEST';
const ADD_COURSE_RESPONSE = 'course/professor/ADD_COURSE_RESPONSE';
const UPDATE_COURSE_REQUEST = 'course/professor/UPDATE_COURSE_REQUEST';
const UPDATE_COURSE_RESPONSE = 'course/professor/UPDATE_COURSE_RESPONSE';
const REMOVE_COURSE_REQUEST = 'course/professor/REMOVE_COURSE_REQUEST';
const REMOVE_COURSE_RESPONSE = 'course/professor/REMOVE_COURSE_RESPONSE';
const STUDENTS_REQUEST = 'course/professor/STUDENTS_REQUEST';
const STUDENTS_RESPONSE = 'course/professor/STUDENTS_RESPONSE';
const ADD_STUDENT_REQUEST = 'course/professor/ADD_STUDENT_REQUEST';
const ADD_STUDENT_RESPONSE = 'course/professor/ADD_STUDENT_RESPONSE';
const UPDATE_STUDENT_REQUEST = 'course/professor/UPDATE_STUDENT_REQUEST';
const UPDATE_STUDENT_RESPONSE = 'course/professor/UPDATE_STUDENT_RESPONSE';
const REMOVE_STUDENT_REQUEST = 'course/professor/REMOVE_STUDENT_REQUEST';
const REMOVE_STUDENT_RESPONSE = 'course/professor/REMOVE_STUDENT_RESPONSE';

// Reducer

const initialState = {
  courses: [],
  selectedCourse: null,
  students: [],
  selectedStudent: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case COURSES_RESPONSE:
      return {
        ...state,
        courses: action.courses,
        selectedCourse: null,
        students: [],
        selectedStudent: null,
      };

    case SET_SELECTED_COURSE:
      return {
        ...state,
        selectedCourse: action.course,
        students: [],
        selectedStudent: null,
      };

    case ADD_COURSE_RESPONSE:
      return {
        ...state,
        courses: [action.course, ...state.courses],
        selectedCourse: action.course,
        students: [],
        selectedStudent: null,
      };

    case UPDATE_COURSE_RESPONSE:
      return {
        ...state,
        courses: state.courses.map(c => c.id === action.course.id ? action.course : c),
      };

    case REMOVE_COURSE_RESPONSE:
      return {
        ...state,
        courses: state.courses.filter(c => c.id !== action.id),
        selectedCourse: null,
        students: [],
        selectedStudent: null,
      };

    case STUDENTS_RESPONSE:
      return {
        ...state,
        students: action.students,
        selectedStudent: null,
      };

    case SET_SELECTED_STUDENT:
      return {
        ...state,
        selectedStudent: action.student,
      };

    case ADD_STUDENT_RESPONSE:
      return {
        ...state,
        students: [action.student, ...state.students],
        selectedStudent: action.student,
      };

    case UPDATE_STUDENT_RESPONSE:
      return {
        ...state,
        students: state.students.map(s => s.id === action.student.id ? action.student : s),
        selectedStudent: action.student,
      };

    case REMOVE_STUDENT_RESPONSE:
      return {
        ...state,
        students: state.students.filter(c => c.id !== action.id),
        selectedStudent: null,
      };

    default:
      return state;
  }
};

// Action Creators

const getCoursesRequest = () => ({
  type: COURSES_REQUEST,
});

const getCoursesSuccess = (courses) => ({
  type: COURSES_RESPONSE,
  courses,
});

export const selectCourse = (course) => ({
  type: SET_SELECTED_COURSE,
  course,
});

const addCourseRequest = () => ({
  type: ADD_COURSE_REQUEST,
});

const addCourseResponse = (course) => ({
  type: ADD_COURSE_RESPONSE,
  course,
});

const updateCourseRequest = () => ({
  type: UPDATE_COURSE_REQUEST,
});

const updateCourseResponse = (course) => ({
  type: UPDATE_COURSE_RESPONSE,
  course,
});

const removeCourseRequest = () => ({
  type: REMOVE_COURSE_REQUEST,
});

const removeCourseSuccess = (id) => ({
  type: REMOVE_COURSE_RESPONSE,
  id,
});

const getStudentsRequest = () => ({
  type: STUDENTS_REQUEST,
});

const getStudentsSuccess = (students) => ({
  type: STUDENTS_RESPONSE,
  students,
});

export const selectStudent = (student) => ({
  type: SET_SELECTED_STUDENT,
  student,
});

const addStudentRequest = () => ({
  type: ADD_STUDENT_REQUEST,
});

const addStudentSuccess = (student) => ({
  type: ADD_STUDENT_RESPONSE,
  student,
});

const updateStudentRegistrationRequest = () => ({
  type: UPDATE_STUDENT_REQUEST,
});

const updateStudentRegistrationSuccess = (student) => ({
  type: UPDATE_STUDENT_RESPONSE,
  student,
});

const removeStudentRequest = () => ({
  type: REMOVE_STUDENT_REQUEST,
});

const removeStudentSuccess = (id) => ({
  type: REMOVE_STUDENT_RESPONSE,
  id,
});


// Thunk actions

export const getCourses = () => (dispatch, getState) => {
  dispatch(getCoursesRequest());

  return professorCourseService.getCourses()
    .then(courses => {
      dispatch(getCoursesSuccess(courses));

      return courses;
    });
};

export const addCourse = (course) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  dispatch(addCourseRequest());

  return professorCourseService.addCourse(course, token)
    .then(course => {
      dispatch(addCourseResponse(course));

      return course;
    });
};

export const updateCourse = (id, course) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  dispatch(updateCourseRequest());

  return professorCourseService.updateCourse(id, course, token)
    .then(course => {
      dispatch(updateCourseResponse(course));

      return course;
    });
};

export const removeCourse = (id) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  dispatch(removeCourseRequest());

  return professorCourseService.removeCourse(id, token)
    .then(() => {
      dispatch(removeCourseSuccess(id));
    });
};

export const getCourseStudents = (id) => (dispatch, getState) => {
  dispatch(getStudentsRequest());

  return professorCourseService.getStudents(id)
    .then(students => {
      const orderedStudents = _.orderBy(
        students,
        ['student.lastName', 'student.firstName', 'student.email'],
        ['asc', 'asc', 'asc']
      );

      dispatch(getStudentsSuccess(orderedStudents));

      return students;
    });
};

export const addStudentToCourse = (courseId, registration) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  dispatch(addStudentRequest());

  return professorCourseService.addStudentToCourse(courseId, registration, token)
    .then(student => {
      dispatch(addStudentSuccess(student));

      return student;
    });
};

export const updateStudentRegistration = (courseId, registrationId, data) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  dispatch(updateStudentRegistrationRequest());

  return professorCourseService.updateStudentRegistration(courseId, registrationId, data, token)
    .then(student => {
      dispatch(updateStudentRegistrationSuccess(student));

      return student;
    });
};

export const removeStudentFromCourse = (courseId, registrationId) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  dispatch(removeStudentRequest());

  return professorCourseService.removeStudentFromCourse(courseId, registrationId, token)
    .then(() => {
      dispatch(removeStudentSuccess(registrationId));
    });
};

export const upload = (id, file) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  return professorCourseService.upload(id, file, token);
}; 
