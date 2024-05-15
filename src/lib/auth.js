import {jwtDecode} from 'jwt-decode';
import Cookie from 'js-cookie';
import api from './api';

export async function verifyToken(token, refreshToken) {
  if (!token) {
    return { authorized: false };
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      if (!refreshToken) {
        return { authorized: false };
      }
      const res = await api.post('/api/token/refresh/', { refresh: refreshToken });

      if (res.status === 200) {
        // Return new access token to update in the client
        Cookie.set('ACCESS_TOKEN', res.data.access, { expires: 1 }); // Expires in 1 day
        return { authorized: true, newToken: res.data.access };
      }

      return { authorized: false };
    }

    return { authorized: true };
  } catch (error) {
    console.error('Token verification failed:', error);
    return { authorized: false };
  }
}