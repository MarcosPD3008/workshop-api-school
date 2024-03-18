import * as yup from 'yup';

export const roleSchema = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required(),
    description: yup.string(),
    permissions: yup.array().of(yup.string())
});
