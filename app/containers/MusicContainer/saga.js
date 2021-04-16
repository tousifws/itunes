import { getTracks } from '@services/musicApi';
import { put, call, takeLatest } from 'redux-saga/effects';
import { musicContainerCreators, musicContainerTypes } from './reducer';

const { REQUEST_GET_ITUNES_TRACKS } = musicContainerTypes;
const { successGetItunesTracks, failureGetItunesTracks } = musicContainerCreators;

export function* getItunesTracks(action) {
  const response = yield call(getTracks, action.searchTerm);
  const { data, ok } = response;

  if (ok) {
    yield put(successGetItunesTracks(data));
  } else {
    yield put(failureGetItunesTracks(data));
  }
}

// Individual exports for testing
export default function* musicContainerSaga() {
  yield takeLatest(REQUEST_GET_ITUNES_TRACKS, getItunesTracks);
}
