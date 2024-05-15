import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import { verifyToken } from '../utils/auth';

export default function useAuth(redirectIfNotAuth, redirectIfAuth) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookie.get('ACCESS_TOKEN');
    const refreshToken = Cookie.get('REFRESH_TOKEN');

    if (!token) {
      if (redirectIfNotAuth) {
        router.replace(redirectIfNotAuth);
      }
      setIsAuthenticated(false);
    } else {
      verifyToken(token, refreshToken).then(({ authorized }) => {
        if (!authorized && redirectIfNotAuth) {
          router.replace(redirectIfNotAuth);
        } else if (authorized && redirectIfAuth) {
          router.replace(redirectIfAuth);
        }
        setIsAuthenticated(authorized);
      });
    }
  }, [router, redirectIfNotAuth, redirectIfAuth]);

  return isAuthenticated;
}