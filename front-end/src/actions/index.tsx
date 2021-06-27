import { Person } from 'shared/models/person';
import * as constants from '../constants';

export function setStudents(students?: Person[]) {
    return {
        type: constants.SET_STUDENTS,
        students
    };
}
