"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useUserThemes } from "@/hooks/theme-hook";
import Link from "next/link";
import { useState } from "react";

export default function ThemesPage() {
  const { user } = useAuth();
  const { themeList, loading } = useUserThemes(user?.id ?? null);
  const [create, setCreate] = useState(false);
  if (!user || loading) return null;
  return (
    <main>
      <section>
        <Button
          onClick={() => {
            setCreate(true);
          }}
        >
          New Theme...
        </Button>
      </section>
      <ul>
        {themeList.map((theme) => {
          return (
            <li key={theme.id}>
              <Link
                href={`/themes/${theme.id}`}
                className="flex justify-around items-center"
              >
                <div>{theme.name}</div>
                <div>{theme.id}</div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
