import axios from 'axios';

export const userLogin = async (loginPayload: {
  email: string | undefined;
  cognito_id: string | undefined;
  created_date: string;
}) => {
  const response = await axios.post('/api/user-signin', loginPayload);
  const userId = response.data.id;
  localStorage.setItem('user_id', userId);
};
