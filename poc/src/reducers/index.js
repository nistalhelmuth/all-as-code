import { combineReducers } from 'redux';
import { reducer as reducerForm } from 'redux-form';
import vm, * as fromVM from './vm';

export default combineReducers({
  vm,
  form: reducerForm,
});

export const getAllVMS = (state) => fromVM.getAllVMS(state.vm);
