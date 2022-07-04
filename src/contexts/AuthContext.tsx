import { createContext, ReactNode, useState, useEffect } from "react";
import { auth, firebase } from "../services/firebase";

export type User = {
  id: string;
  name: string;
  avatar: string;
};

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
  admin: boolean;
  setAdmin: React.Dispatch<React.SetStateAction<boolean>>;
};
type AuthContextProviderProps = {
  children: ReactNode;
};



export const AuthContext = createContext({} as AuthContextType);
export const AuthContextProvider = (props: AuthContextProviderProps) => {
  const [user, setUser] = useState<User>();
  const [dark, setDark] = useState(() => {
    const theme = localStorage.getItem("darkmode");
  
    return theme ? JSON.parse(theme) : false;
  });
  const [admin, setAdmin] = useState(false)
 
  
 
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error("Missing information from Google Account");
        }
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);


  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        throw new Error("Missing information from Google Account");
      }
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });

    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, dark, setDark, admin, setAdmin}}>
      {props.children}
    </AuthContext.Provider>
  );
};
