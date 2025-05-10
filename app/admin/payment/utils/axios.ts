import setCurrentUserOnServer from "@/app/actions/setCurrentUser";
import { DEFAULT_CURRENT_USER } from "@/app/constants/auth";
import { parse } from "@/app/utils/objectManip";
import axios, { InternalAxiosRequestConfig } from "axios";

// Create an axios instance
export const baseURL = "https://back-duerp.vercel.app";
const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
const getCurrentUser = (): CurrentUser | Record<string, any> => {
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

// Add a request interceptor to attach the token to every request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const currentUser = getCurrentUser();
    const token = currentUser.accessToken; // Get token from localStorage
    if (token) {
      config.headers["x-access-token"] = token; // Attach token to Authorization header
    }
    return config;
  },
  (error) => {
    const isUnauthenticated = error.response && error.response.status === 401;
    if (isUnauthenticated) {
      resetCurrentUser();
      window.location.href = "/auth/signin";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
