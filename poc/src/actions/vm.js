import * as types from '../types/vm';

export const fetchVms = () => ({
  type: types.VMS_FETCHED,
  payload:{

  }
});
  
export const fetchVmsSuccess = ({
  vms,
}) => ({
  type: types.VMS_FETCHED_SUCCEDDED,
  payload:{
    vms
  }
});

export const fetchVmsFail = ({
  message,
}) => ({
  type: types.VMS_FETCHED_FAILED,
  payload:{
    message,
  }
});

export const createVm = ({
  name,
  type
}) => ({
  type: types.VM_POSTED,
  payload: {
    name,
    type
  },
});

export const createVmFail = ({
  message,
}) => ({
  type: types.VM_POSTED_SUCCEDDED,
  payload: {
    message,
  },
});

export const deleteVm = ({
  name,
}) => ({
  type: types.VM_DELETED,
  payload: {
    name,
  },
});

export const deleteVmFail = ({
  message,
}) => ({
  type: types.VM_DELETED_FAILED,
  payload: {
    message,
  },
});
