import { jwtDecode } from "jwt-decode";
import Cookie from "js-cookie";
import axios from "axios";

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

      const res = await axios.post(
        "http://localhost:8000/api/token/refresh/",
        { refresh: refreshToken },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        // Return new access token to update in the client
        Cookie.set("ACCESS_TOKEN", res.data.access, { expires: 7 }); // Expires in 1 day
        Cookie.set("REFRESH_TOKEN", res.data.refresh, { expires: 1 });
        return { authorized: true, newToken: res.data.access };
      }
      return { authorized: false };
    }
    const res = await axios.get(
      "http://localhost:8000/verify-token/",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // console.log(res);
    return { authorized: true };
  } catch (error) {
    console.error("Token verification failed:", error);
    return { authorized: false };
  }
}
