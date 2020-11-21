import {
  put,
  takeLatest,
  call,
} from 'redux-saga/effects';
import * as types from '../types/vm';
import * as actions from '../actions/vm';
import * as api from '../apis/vm';

function* vmsFetcher() {
  try {
    const response = yield call(
      api.fetchVms,
    );
    yield put(actions.fetchVmsSuccess({
      vms: response,
    }));
  } catch (error) {
    yield put(actions.fetchVmsFail({
      message: error.message,
    }));
  }
}
  /**

function* vmStatusFetcher(action) {
  const {
    payload: {
      ip,
    },
  } = action;
  const response = yield call(
    api.fetchVmStatus,
    '34.67.71.239',
  );
  console.log(response);
  yield put(actions.fetchVmStatusSuccess({
    log: response,
  }));
  try {
    
  } catch (error) {
    yield put(actions.fetchVmStatusFail({
      message: error,
    }));
  }
}
  */

function* vmsCreator(action) {
  const {
    payload: {
      name,
      type,
    },
  } = action;
  try {
    const { response } = yield call(
      api.createVm,
      name,
      type,
    );
    yield put(actions.fetchVmsSuccess({
      vms: response,
    }));
  } catch (error) {
    yield put(actions.createVmFail({
      message: error.message,
    }))
  }
}

function* vmsDeleter(action) {
  const {
    payload: {
      name,
    },
  } = action;
  try {
    yield call(
      api.deleteVm,
      name
    );
    yield put(actions.fetchVms());
  } catch (error) {
    yield put(actions.deleteVmFail({
      message: error.message,
    }))
  }
}

function* VmsSaga() {
yield takeLatest(
  types.VMS_FETCHED,
  vmsFetcher,
);
/**
yield takeLatest(
  types.VM_FETCHED_STATUS,
  vmStatusFetcher,
);
 */
yield takeLatest(
  types.VM_POSTED,
  vmsCreator,
);
yield takeLatest(
  types.VM_DELETED,
  vmsDeleter,
);
}

export default VmsSaga;