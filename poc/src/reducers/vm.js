import { combineReducers } from 'redux';
import * as types from '../types/vm';

const defaultState = {
  ip: undefined,
}


const modal = (state = defaultState, action) => {
  switch (action.type) {
    case types.VM_FETCHED_STATUS: {
      const {
        payload: {
          ip,
        },
      } = action;
      return {ip};
    }
    case types.VM_FETCHED_STATUS_CLOSED: {
      return defaultState;
    }
    default: {
      return state;
    }
  }
}

const byId = (state={}, action) => {
  switch (action.type) {
    case types.VMS_FETCHED: {
      return {};
    }
    case types.VMS_FETCHED_SUCCEDDED: {
      const {
        payload: {
          vms,
        },
      } = action;
      const newState = {}
      for (let i in vms) {
        newState[i] = {
          ...vms[i],
          machineType: vms[i].machineType.substring(vms[i].machineType.lastIndexOf('/')+1)
        };
      }
      return newState;
    }
    default: {
      return state;
    }
  }
}

const order = (state=[], action) => {
  switch (action.type) {
    case types.VMS_FETCHED: {
      return [];
    }
    case types.VMS_FETCHED_SUCCEDDED: {
      const {
        payload: {
          vms,
        },
      } = action;
      const newState = Object.values(vms).map((vm, i) => i);
      return newState;
    }
    default: {
      return state;
    }
  }
}



export default combineReducers({
  modal,
  byId,
  order
})

//selectores
export const getAllVMS = (state) => state.order.map((id) => state.byId[id])
export const getLog = (state) => state.modal.ip;

