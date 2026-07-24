import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from '../context/SessionContext'

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    console.log("AuthProvider - checking for user token");
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        console.log("AuthProvider - user token set");
      } catch {
        // If parsing fails, clear bad data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);



  function signIn(nextUser, nextToken) {
    // ✅ Always include bio + interestTags
    const mergedUser = {
      ...nextUser,
      bio: nextUser.bio,
      interestTags: nextUser.interestTags,
    };

    setUser(mergedUser);
    setToken(nextToken);
    localStorage.setItem("user", JSON.stringify(mergedUser));
    localStorage.setItem("token", nextToken);

    // ✅ Clear guest session once logged in
    localStorage.removeItem("shadesOfSgGuestSession");
  }
  
  function signOut() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  }


  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
