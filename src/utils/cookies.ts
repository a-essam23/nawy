"use server";

import { cookies } from "next/headers";

export const getCookie = async (name: string): Promise<string | null> => {
  const cookieStore = await cookies();
  const value = cookieStore.get(name);
  return value?.value || null;
};
export const setCookie = async (name: string, value: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    expires: 30,
    path: "/",
    // secure: process.env.NODE_ENV === 'production',
    // sameSite: 'lax'
  });
};
