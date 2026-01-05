"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "../ui/button";

export default function LoginForm() {
  const { signInWithGithub, loading } = useAuth();

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4"></div>
        <h1>NextDoX</h1>
        <p className="text-slate-600 font-medium">
          Beautiful project management made simple
        </p>
      </div>
      <Button onClick={signInWithGithub} disabled={loading}>
        <span>{loading ? "Signing in..." : "Continue with Github"}</span>
      </Button>
    </div>
  );
}
