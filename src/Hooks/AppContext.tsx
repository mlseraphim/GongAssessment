import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { TAppState, TAppContext } from '../Infrastructure/Types';
import type { IUser } from '../Infrastructure/Interfaces';


const AppContext = createContext<TAppContext | undefined>(undefined);


export function AppContextProvider({ children }: { children: ReactNode }) {
  const [appState, setAppState] = useState<TAppState>({
    isLoading: false,
    isLoggedIn: false,
    currentUser: null
  });


  /* ***** LOADING CONTEXT ITEMS ***** */
  const setIsLoading = (value: boolean) => {
    setAppState((prev: TAppState) => ({
      ...prev,
      isLoading: value
    }));
  };
  /* ***** LOADING CONTEXT ITEMS ***** */


  /* ***** LOGGED-IN CONTEXT ITEMS ***** */
  const login = async (currentUser: IUser, userSecret: string) => {
    setAppState((prev: TAppState) => ({
      ...prev,
      isLoggedIn: true,
      currentUser: currentUser,
      userSecret: userSecret
    }));
  };

  const logout = () => {
    setAppState(prev => ({
      ...prev,
      isLoggedIn: false
    }));
  };
  /* ***** LOGGED-IN CONTEXT ITEMS ***** */


  const contextValue = useMemo<TAppContext>(
    () => ({
      ...appState,

      setIsLoading: (value: boolean) => setIsLoading(value),
      
      login: (currentUser: IUser, userSecret: string) => login(currentUser, userSecret),
      logout: () => logout()
    }),
    [appState]
  );


  return (
    <AppContext.Provider value={ contextValue }>
      { children }
    </AppContext.Provider>
  );
}


export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used inside AppContextProvider');
  }

  return context;
}