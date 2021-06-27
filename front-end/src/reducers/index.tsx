import * as ACTIONS from '../constants/index';
import { StoreState } from '../types';

const initState: StoreState = {
  students: [],
};

export default function studentReducer(state: StoreState = initState, action: any): StoreState {
  switch (action.type) {
    case ACTIONS.SET_STUDENTS:
      return { ...state, students: action.students || [] };

    default:
      return state;
  }
}
