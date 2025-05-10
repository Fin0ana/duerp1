"use server";
import { cookies } from "next/headers";
import { KeyString } from "../modules/utils/types";
import { DEFAULT_CURRENT_USER } from "../constants/auth";

export default async function getCurrentUserOnServer(): Promise<CurrentUser> {
  if (typeof window !== "undefined") return DEFAULT_CURRENT_USER;
  const cookie = await cookies();
  const _currentUser = cookie.get("currentUser")?.value || "{}";
  let currentUser: CurrentUser = DEFAULT_CURRENT_USER;
  try {
    currentUser = JSON.parse(_currentUser);
  } catch (error) {
    currentUser = DEFAULT_CURRENT_USER;
  }
  return currentUser;
}
