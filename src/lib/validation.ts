import * as yup from 'yup';

export const loginSchema = yup.object({
  username: yup.string().required('Username cannot be empty').min(4, 'Username cannot be less than 4 characters'),
  password: yup.string().required('Password cannot be empty'),
});

export const searchSchema = yup.object({
  examDate: yup.date(),
  examId: yup.string(),
  medicalId: yup.string(),
});
