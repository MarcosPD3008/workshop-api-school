import * as yup from 'yup';

export const userSchema = yup.object().shape({
    id: yup.number(),
    fullName: yup.string().required(),
    username: yup.string().required(),
    password: yup.string().required(),
    roleId: yup.number().required()
});