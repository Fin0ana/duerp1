import axios from "axios";
import { useLocalStorage } from "react-use";
import { DEFAULT_CURRENT_USER } from "../constants/auth";
import { parse } from "./objectManip";
import { KeyString } from "../modules/utils/types";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "../store/auth/authStore";
import setCurrentUserOnServer from "../actions/setCurrentUser";
const baseURL: string = process.env.NEXT_PUBLIC_API_URL as string;

const getCurrentUser = (): CurrentUser | KeyString => {
  if (typeof window !== "undefined")
    return parse<CurrentUser>(window.localStorage.getItem("currentUser"));
  return {};
};
const resetCurrentUser = () => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    "currentUser",
    JSON.stringify(DEFAULT_CURRENT_USER)
  );
  setCurrentUserOnServer(DEFAULT_CURRENT_USER);
};

const currentUser = getCurrentUser();

const axiosInstance = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
    "x-access-token": currentUser?.accessToken,
  },
});

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const isUnauthenticated = error.response && error.response.status === 401;
    if (isUnauthenticated) {
      resetCurrentUser();
      window.location.href = "/auth/signin"
    }
    const isUnauthorized = error.response && error.response.status === 403
    if (isUnauthorized) {
      window.location.href = `/403?message=${error.response.data.message}`;
    }
    return Promise.reject(error);
  }
);

export { baseURL };
export default axiosInstance;
