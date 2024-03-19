import * as yup from 'yup';
export { userSchema } from './userSchema';
export { roleSchema } from './roleSchema';


// Schema for individual subjects
export const subjectSchema = yup.object({
  id: yup.number().required(),
  name: yup.string().required(),
});

// Schema for subject teachers
export const subjectTeacherSchema = yup.object({
  id: yup.number().required(),
  usersId: yup.number().required(),
  subjectId: yup.number().required(),
});

// Schema for subject students
export const subjectStudentSchema = yup.object({
  id: yup.number().required(),
  usersId: yup.number().required(),
  subjectsId: yup.number().required(),
});

// Schema for grades
export const gradeSchema = yup.object({
  id: yup.number().required(),
  usersId: yup.number().required(),
  subjectId: yup.number().required(),
  grade: yup.number().required().min(0).max(100), // Assuming grades are between 0 and 100
});