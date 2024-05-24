import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getToken, logout } from "../utils/auth";

const UserPermissionsContext = createContext();

export const UserPermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = getToken(); // Get the token

    if (!token) {
      console.log("No token found, skipping permissions fetch.");
      return;
    }

    const fetchPermissions = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user_permissions/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch permissions");
        }

        const data = await response.json();
        setPermissions(data);
      } catch (error) {
        console.error("Error fetching user permissions:", error);

        performClientSideLogout();
      }
    };

    fetchPermissions();
  }, []);

  function performClientSideLogout() {
    logout();
    router.push("/signin");
  }

  return (
    <UserPermissionsContext.Provider value={permissions} >
      {children}
    </UserPermissionsContext.Provider>
  );
};

export const useUserPermissions = () => useContext(UserPermissionsContext);
