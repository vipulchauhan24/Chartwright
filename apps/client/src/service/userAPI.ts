import axios from 'axios';
import {
  removeFromLocalStorage,
  storeInLocalStorage,
} from '../app/charteditor/utils/lib';
import { LOCAL_STORAGE_KEYS } from '../app/charteditor/utils/constants';

export const userLogin = async (loginPayload: {
  email: string | undefined;
  cognitoId: string | undefined;
  createdDate: string;
}) => {
  removeFromLocalStorage(LOCAL_STORAGE_KEYS.USER_ID);
  const response = await axios.put('/api/login', loginPayload);
  const userId = response.data.id;
  storeInLocalStorage(LOCAL_STORAGE_KEYS.USER_ID, userId);
};
