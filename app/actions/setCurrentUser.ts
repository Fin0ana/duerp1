"use server"

import { cookies } from "next/headers";

export default async function setCurrentUserOnServer(user: string | undefined) {
  const cookie = await cookies();
  cookie.set("authToken", user || "");
}
