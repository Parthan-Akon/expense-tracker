"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
  user: string | null;
  setUser: (user: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if(!context){
    throw new Error("Use context must be user within a App provider")
  }
  return context;
};
