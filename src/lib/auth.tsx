import React, { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "../auth";

// Define an interface that matches the expected shape in the rest of the app
interface AuthContextType {
  user: { id: string; [key: string]: unknown } | null;
  session: { [key: string]: unknown } | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending, error } = authClient.useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending) {
      setLoading(false);
    }
  }, [isPending]);

  const signOut = async () => {
    setLoading(true);
    try {
      await authClient.signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: data?.user ?? null,
        session: data?.session ?? null,
        loading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
