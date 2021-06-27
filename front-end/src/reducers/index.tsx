import * as ACTIONS from '../constants/index';
import { StoreState } from '../types';

const initState: StoreState = {
  students: [],
  rollStatus: 'all',
};

export default function studentReducer(state: StoreState = initState, action: any): StoreState {
  switch (action.type) {
    case ACTIONS.SET_STUDENTS:
      return { ...state, students: action.students || [] };

    case ACTIONS.SET_ATTENDANCE_STATUS:
      let storeStudents = [...state.students];
      let indexOfStudent = storeStudents.findIndex((student: any) => student.id === action.payload.id);
      storeStudents[indexOfStudent].rollState = action.payload.type;
      return { ...state, students: [...storeStudents] };
    
    case ACTIONS.SET_ROLL_STATUS:
      return { ...state, rollStatus: action.payload.type };  

    default:
      return state;
  }
}
