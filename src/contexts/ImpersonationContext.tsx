import { createContext, useContext, useState } from 'react';

interface ImpersonationContextType {
  impersonatedUserId: string | null;
  startImpersonation: (userId: string) => void;
  stopImpersonation: () => void;
}

const ImpersonationContext = createContext<ImpersonationContextType | null>(null);

export function ImpersonationProvider({ children }: { children: React.ReactNode }) {
  const [impersonatedUserId, setImpersonatedUserId] = useState<string | null>(null);

  const startImpersonation = (userId: string) => setImpersonatedUserId(userId);
  const stopImpersonation = () => setImpersonatedUserId(null);

  return (
    <ImpersonationContext.Provider value={{
      impersonatedUserId,
      startImpersonation,
      stopImpersonation,
    }}>
      {children}
    </ImpersonationContext.Provider>
  );
}

export const useImpersonation = () => {
  const context = useContext(ImpersonationContext);
  if (!context) {
    throw new Error('useImpersonation must be used within an ImpersonationProvider');
  }
  return context;
};