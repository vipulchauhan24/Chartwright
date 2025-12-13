import { api } from '../app/api-client';

export const userLogin = async (loginPayload: {
  email: string | undefined;
  cognitoId: string | undefined;
  createdDate: string;
}) => {
  await api.instance.put('/api/login', loginPayload);
};
