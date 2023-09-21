import { router, useRootNavigationState, useSegments } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../utils/firebaseConfig";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { User as UserData } from "../types/threads";
import { doc, getDoc } from "firebase/firestore";

interface User {
  uid: string;
  createdAt: string;
  displayName: string;
  lastLoginAt: string;
  photoURL: string;
  providerId: string;
  email: string;
}

interface ContextInterface {
  user: User | null;
  userData: UserData | null;
  signIn: Dispatch<SetStateAction<User>>;
  signOut: () => void;
  setUserData: Dispatch<SetStateAction<UserData>>;
}

const initialState = {
  uid: "",
  createdAt: "",
  displayName: "",
  lastLoginAt: "",
  photoURL: "",
  providerId: "",
  email: "",
};

const userDataInitialState = {
  uid: "",
  displayName: "",
  username: "",
  verified: false,
  photoURL: "",
  bio: "",
};

const contextInitialState: ContextInterface = {
  user: initialState,
  userData: userDataInitialState,
  signIn: () => {},
  signOut: () => {},
  setUserData: () => {},
};

const AuthContext = createContext(contextInitialState);

export function useAuth(): ContextInterface {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a Provider");
  }

  return context;
}

function useProtectedRoute(user: User) {
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (!navigationState.key || hasNavigated) return;
    const inAuthGroup = segments[0] === "(auth)";

    if (!user.uid && !inAuthGroup) {
      router.replace("/(auth)/sign-in");
      setHasNavigated(true);
    } else if (user.uid && inAuthGroup) {
      router.replace("/(tabs)/");
      setHasNavigated(true);
    }
  }, [user.uid, segments, navigationState, hasNavigated]);
}

export function AuthProvider({ children }: PropsWithChildren): ReactNode {
  const [user, setUser] = useState<User>(initialState);
  const [userData, setUserData] = useState<UserData>(userDataInitialState);
  useProtectedRoute(user);
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // console.log(JSON.stringify(user, null, 2));
        const dataWeCareAbout: User = {
          uid: user.uid,
          displayName: user.providerData[0].displayName ?? "",
          photoURL: user.providerData[0].photoURL ?? "",
          providerId: user.providerData[0].providerId,
          email: user.providerData[0].email ?? "",
          createdAt: user.metadata.creationTime!,
          lastLoginAt: user.metadata.lastSignInTime!,
        };
        setUser(dataWeCareAbout);
        const getUser = async () => {
          const userRef = doc(db, "users", dataWeCareAbout.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUserData({ ...userDoc.data(), uid: userDoc.id });
          }
        };
        await getUser();
        router.replace("/(tabs)");
      } else {
        // console.log("user is not authenticated");
        router.replace("/(auth)/sign-in");
      }
    });
    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        signIn: setUser,
        signOut: () => {
          setUser(initialState);
          signOut(auth);
        },
        setUserData: setUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
