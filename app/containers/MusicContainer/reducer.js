/*
 *
 * HomeContainer reducer
 *
 */
import produce from 'immer';
import { createActions } from 'reduxsauce';
import get from 'lodash/get';

export const { Types: musicContainerTypes, Creators: musicContainerCreators } = createActions({
  requestGetItunesTracks: ['searchTerm'],
  successGetItunesTracks: ['data'],
  failureGetItunesTracks: ['error'],
  clearItunesTracks: []
});

export const initialState = {
  searchTerm: null,
  musicData: {},
  musicError: null
};

/* eslint-disable default-case, no-param-reassign */
export const musicContainerReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case musicContainerTypes.REQUEST_GET_ITUNES_TRACKS:
        draft.searchTerm = action.searchTerm;
        break;

      case musicContainerTypes.CLEAR_ITUNES_TRACKS:
        return initialState;

      case musicContainerTypes.SUCCESS_GET_ITUNES_TRACKS:
        draft.musicData = action.data;
        break;

      case musicContainerTypes.FAILURE_GET_ITUNES_TRACKS:
        draft.musicError = get(action.error, 'message', 'something_went_wrong');
        break;
    }
  });

export default musicContainerReducer;
