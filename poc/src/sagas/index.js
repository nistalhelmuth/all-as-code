import { fork, all } from 'redux-saga/effects';
import VmsSaga from './vm';

function* mainSaga() {
  yield all([
    fork(VmsSaga),
  ]);
}

export default mainSaga;
