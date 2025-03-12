"use client";

import { DEFAULT_CURRENT_USER } from "@/app/constants/auth";
import _api from "@/app/_endpoints";
import axiosInstance from "@/app/admin/payment/utils/axios";
import { useLocalStorage } from "react-use";
import setCurrentUserOnServer from "@/app/actions/setCurrentUser";
import { asyncTimeout } from "@/app/modules/utils/global";
import {
  createContext,
  ReactElement,
  useContext,
  useMemo,
  useState,
} from "react";

type AuthStoreStates = {
  currentUser: CurrentUser;
  pending: boolean;
  setAllVariablesUser: (_currentUser: CurrentUser) => Promise<void>;
  login: (data: LoginParams) => Promise<CurrentUser>;
  logout: () => Promise<void>;
  register: (data: RegisterParams) => Promise<CurrentUser>;
  whenHasRole: WhenHasRole;
  initials: string;
};

type WhenHasRole = <T>(role: UserRole | UserRole[]) => {
  show: (...toShow: T[]) => T[];
};

export const AuthContext = createContext<AuthStoreStates>({
  currentUser: DEFAULT_CURRENT_USER,
  pending: false,
  setAllVariablesUser: async () => {},
  login: async () => DEFAULT_CURRENT_USER,
  logout: async () => {},
  register: async () => DEFAULT_CURRENT_USER,
  whenHasRole: () => ({ show: () => [] }),
  initials: "",
});

const useAuthStore = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactElement }) => {
  const [_currentUser, setCurrentUser] = useLocalStorage<CurrentUser>(
    "currentUser",
    DEFAULT_CURRENT_USER
  );

  const currentUser = useMemo(() => {
    return _currentUser || DEFAULT_CURRENT_USER;
  }, [JSON.stringify(_currentUser)]);
  
  // This function (refStore) transform to vue syntax
  const [pending, setPending] = useState<boolean>(false);

  // Set all the user variable (storage, axios header, state) to value
  const setAllVariablesUser = async (_currentUser: CurrentUser) => {
    setCurrentUser(_currentUser);
    await setCurrentUserOnServer(_currentUser);
    axiosInstance.defaults.headers["x-access-token"] =
      _currentUser.accessToken || "";
  };

  const login = async (data: LoginParams) => {
    try {
      setPending(true);
      const response = await axiosInstance.post<CurrentUser>(
        _api.auth.signIn,
        data
      );
      await setAllVariablesUser(response.data);
      await asyncTimeout(2000);
      setPending(false);
      return response.data;
    } catch (error) {
      console.log(error);
      await setAllVariablesUser(DEFAULT_CURRENT_USER);
      setPending(false);
      throw error;
    }
  };

  const logout = async () => {
    await setAllVariablesUser(DEFAULT_CURRENT_USER);
  };

  const register = async (data: RegisterParams) => {
    try {
      setPending(true);
      await axiosInstance.post(_api.auth.signUp, data);
      const response = await login({
        username: data.username,
        password: data.password,
      });
      setPending(false);
      return response;
    } catch (error) {
      setPending(false);
      throw error;
    }
  };

  const whenHasRole: WhenHasRole = (role) => {
    return {
      show: (...toShow) => {
        return role.includes(currentUser?.role || "simple") ? toShow : [];
      },
    };
  };

  const initials = useMemo(() => {
    const firstInitial = currentUser?.firstName?.charAt(0) || ""; // Prend la première lettre si firstName existe
    const lastInitial = currentUser?.name.charAt(0) || "D"; // Toujours présent
    return (firstInitial + lastInitial).toUpperCase();
  }, [currentUser?.name, currentUser?.firstName]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        pending,
        setAllVariablesUser,
        login,
        logout,
        register,
        whenHasRole,
        initials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default useAuthStore;
