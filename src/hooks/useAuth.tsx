// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { createContext, useContext, useEffect, useMemo, useState } from "react";
// import * as AuthApi from "../api/auth";

// type User = { id: number; email?: string | null };
// type Ctx = {
//   bootstrapped: boolean;
//   token: string | null;
//   user: User | null;
//   signIn: (email: string, password: string) => Promise<void>;
//   signUp: (email: string, password: string) => Promise<void>;
//   signOut: () => Promise<void>;
// };
// const AuthCtx = createContext<Ctx | null>(null);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [bootstrapped, setBootstrapped] = useState(false);
//   const [token, setToken] = useState<string | null>(null);
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     (async () => {
//       const t = await AsyncStorage.getItem("auth_token");
//       const u = await AsyncStorage.getItem("auth_user");
//       setToken(t);
//       setUser(u ? JSON.parse(u) : null);
//       setBootstrapped(true);
//     })();
//   }, []);

//   const signIn = async (email: string, password: string) => {
//     const res = await AuthApi.login(email, password);
//     await AsyncStorage.setItem("auth_token", res.token);
//     await AsyncStorage.setItem("auth_user", JSON.stringify(res.user));
//     setToken(res.token);
//     setUser(res.user);
//   };

//   const signUp = async (email: string, password: string) => {
//     const res = await AuthApi.signup(email, password);
//     await AsyncStorage.setItem("auth_token", res.token);
//     await AsyncStorage.setItem("auth_user", JSON.stringify(res.user));
//     setToken(res.token);
//     setUser(res.user);
//   };

//   const signOut = async () => {
//     await AsyncStorage.multiRemove(["auth_token", "auth_user"]);
//     setToken(null);
//     setUser(null);
//   };

//   const value = useMemo(() => ({ bootstrapped, token, user, signIn, signUp, signOut }), [bootstrapped, token, user]);

//   return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
// }

// export function useAuthProvider() {
//   const ctx = useContext(AuthCtx);
//   if (!ctx) throw new Error("useAuthProvider must be used within <AuthProvider>");
//   return ctx;
// }



// import AsyncStorage from "@react-native-async-storage/async-storage";
// import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
// import * as AuthApi from "../api/auth";

// type User = { id: number; email?: string | null };

// type Ctx = {
//   bootstrapped: boolean;
//   token: string | null;
//   user: User | null;
//   signIn: (email: string, password: string) => Promise<void>;
//   signUp: (username: string, email: string, password: string) => Promise<void>;
//   signOut: () => Promise<void>;
// };

// const AuthCtx = createContext<Ctx | null>(null);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [bootstrapped, setBootstrapped] = useState(false);
//   const [token, setToken] = useState<string | null>(null);
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     (async () => {
//       const t = await AsyncStorage.getItem("auth_token");
//       const u = await AsyncStorage.getItem("auth_user");
//       setToken(t);
//       setUser(u ? JSON.parse(u) : null);
//       setBootstrapped(true);
//     })();
//   }, []);

//   const signIn = async (username: string, password: string) => {
//     const res = await AuthApi.loginWithUsername(username, password);
//     await AsyncStorage.setItem("auth_token", res.token);
//     await AsyncStorage.setItem("auth_user", JSON.stringify(res.user));
//     setToken(res.token);
//     setUser(res.user);
//   };


//   const signUp = async (username: string, email: string, password: string) => {
//     const res = await AuthApi.signup(username, email, password);
//     await AsyncStorage.setItem("auth_token", res.token);
//     await AsyncStorage.setItem("auth_user", JSON.stringify(res.user));
//     setToken(res.token);
//     setUser(res.user);
//   };

//   const signOut = async () => {
//     await AsyncStorage.multiRemove(["auth_token", "auth_user"]);
//     setToken(null);
//     setUser(null);
//   };

//   const value = useMemo(
//     () => ({ bootstrapped, token, user, signIn, signUp, signOut }),
//     [bootstrapped, token, user]
//   );

//   return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
// }

// export function useAuthProvider() {
//   const ctx = useContext(AuthCtx);
//   if (!ctx) throw new Error("useAuthProvider must be used within <AuthProvider>");
//   return ctx;
// }



import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from '@tanstack/react-query';
import * as AuthApi from "../api/auth";

type User = { userId: string; username: string; email: string };

type Ctx = {
  bootstrapped: boolean;
  token: string | null;
  user: User | null;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [bootstrapped, setBootstrapped] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem("auth_token");
      const u = await AsyncStorage.getItem("auth_user");
      setToken(t);
      setUser(u ? JSON.parse(u) : null);
      setBootstrapped(true);
    })();
  }, []);

  const signIn = async (username: string, password: string) => {
    // Clear all cached data before new user login
    queryClient.clear();
    
    const res = await AuthApi.loginWithUsername(username, password);
    await AsyncStorage.setItem("auth_token", res.token);
    await AsyncStorage.setItem("auth_user", JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
  };

  const signUp = async (username: string, email: string, password: string) => {
    // Clear all cached data for new user registration
    queryClient.clear();
    
    const res = await AuthApi.signup(username, email, password);
    await AsyncStorage.setItem("auth_token", res.token);
    await AsyncStorage.setItem("auth_user", JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
  };

  const signOut = async () => {
    // Clear all cached data on logout
    queryClient.clear();
    
    await AsyncStorage.multiRemove(["auth_token", "auth_user"]);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ bootstrapped, token, user, signIn, signUp, signOut }),
    [bootstrapped, token, user]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuthProvider() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuthProvider must be used within <AuthProvider>");
  return ctx;
}
