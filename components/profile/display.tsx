"use client";

import { useAuth } from "@/contexts/auth-context";
import { useUserProfile } from "@/hooks/profile-hook";

export const ProfileDisplay = () => {
  const { user } = useAuth();
  const { profile, loading } = useUserProfile(user?.id ?? null);

  if (!user || loading) return null;
  return (
    <main>
      <section id="header">
        <div id="avatar">{profile?.avatar_url ?? "User"}</div>
        <div id="basic-details">
          <div id="username">{profile?.username ?? "User"}</div>
          <div id="email">{profile?.email ?? "User Email"}</div>
          <div id="dev_type">{profile?.dev_type ?? "User Dev Type"}</div>
          <div id="contact_links">{profile?.urls ?? "User Urls"}</div>
        </div>
      </section>
      <section id="skills-crarousle-infinite">
        {profile?.skills ?? "User Skills"}
      </section>
      <section id="stats: projects and tasks">
        Nothing to show here.(at the moment)
      </section>
      <section id="heatmap for tasks">
        Nothing to show here.(at the moment)
      </section>
    </main>
  );
};
