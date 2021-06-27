import { Person } from 'shared/models/person';
import * as constants from '../constants';

export function setStudents(students?: Person[]) {
    return {
        type: constants.SET_STUDENTS,
        students
    };
}

export function setAttendanceStatus(type:string, id:number) {
    return {
        type: constants.SET_ATTENDANCE_STATUS,
        payload: { type, id }
    };
}

export function setRollStatus(type:string) {
    return {
        type: constants.SET_ROLL_STATUS,
        payload: { type }
    };
}

