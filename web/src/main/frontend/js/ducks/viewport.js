// Actions

const SET_SIZE = 'viewport/SET_SIZE';

// Initial state

const initialState = {
  width: document && document.documentElement ? document.documentElement.clientWidth : null,
  height: document && document.documentElement ? document.documentElement.clientHeight : null
};

// Reducer

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SIZE:
      return {
        width: action.width || state.width,
        height: action.height || state.height
      };

    default:
      return state;
  }
};

// Action creators

export const resize = (width, height) => ({
  type: SET_SIZE,
  width,
  height,
});
