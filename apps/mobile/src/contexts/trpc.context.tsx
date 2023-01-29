import { createContext, useMemo } from 'react';
import { getTrpcClient, TrpcClient } from '../lib/trpc';

export const TrpcClientContext = createContext({} as TrpcClient);

function TrpcProvider({ children }) {
  const client = useMemo(() => {
    return getTrpcClient();
  }, []);

  return (
    <TrpcClientContext.Provider value={client}>
      {children}
    </TrpcClientContext.Provider>
  );
}

export default TrpcProvider;
