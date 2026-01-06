"use client";
//Todo: Change the type of user form auth user(supabase) to user profile(table) for better info management accross the application

import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

export default function AuthButton() {
  const { user, signOut } = useAuth();
  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <div className="flex justify-around items-end">
      <Link
        href="/auth/sign-in"
        className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        Login
      </Link>
      <Link
        href="/auth/sign-up"
        className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        Create Account
      </Link>
    </div>
  );
}
