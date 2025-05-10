"use server";
import axios, { AxiosRequestConfig } from "axios";
import getCurrentUserOnServer from "./getCurrentUser";
const baseURL: string = process.env.NEXT_PUBLIC_API_URL as string;

export default async function axiosGet<T extends any>(
  url: string,
  config?: AxiosRequestConfig<any> | undefined,
  init?: Omit<RequestInit, "method" | "headers"> | undefined
) {
  const currentUser = await getCurrentUserOnServer();

  const axiosServerInstance = axios.create({
    baseURL,
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      "x-access-token": currentUser?.accessToken,
    },
  });
  const response = await axiosServerInstance.get<T>(url, config);
  return response.data;
}
