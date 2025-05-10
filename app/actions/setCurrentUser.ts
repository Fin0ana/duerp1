"use server";

import { cookies } from "next/headers";
import { COOKIES_DURATION } from "../constants/auth";

export default async function setCurrentUserOnServer(user: CurrentUser) {
  const cookie = await cookies();
  cookie.set("currentUser", JSON.stringify(user), {
    maxAge: COOKIES_DURATION,
    sameSite: "lax",
  });
}
