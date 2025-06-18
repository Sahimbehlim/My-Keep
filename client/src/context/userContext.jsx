import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const UserContext = createContext({
  token: null,
  setToken: () => {},
});

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get("authToken") || null);

  useEffect(() => {
    if (token) {
      Cookies.set("authToken", token, { expires: 7 });
    } else {
      Cookies.remove("authToken");
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
