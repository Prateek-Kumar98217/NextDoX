"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { MapPin, Mail, Calendar, Edit2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InfiniteSkillsCarousel } from "@/components/infinite-carousel";
import Link from "next/link";
import { useUserProfile } from "@/hooks/profile-hook";
import { useAuth } from "@/contexts/auth-context";

export default function Profile() {
  const { user } = useAuth();
  const { profile, loading } = useUserProfile(user?.id ?? null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".profile-header", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".profile-avatar", {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: "back.out(1.7)",
      });

      gsap.from(".profile-info", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.4,
        ease: "power2.out",
      });

      gsap.from(".skills-section", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: 0.6,
        ease: "power2.out",
      });

      gsap.from(".stats-card", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.8,
        ease: "power2.out",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { label: "Projects", value: "12" },
    { label: "Tasks Completed", value: "156" },
    { label: "Team Members", value: "8" },
  ];

  if (!user || loading) return null;

  return (
    <div ref={pageRef} className="min-h-screen p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="profile-header glass-card rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="profile-avatar relative">
              <Avatar className="w-32 h-32 ring-4 ring-primary/30">
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                  {profile?.username?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-xs">✓</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="profile-info text-3xl font-bold">
                  {profile?.username || "User"}
                </h1>
                <Link href="/settings">
                  <Button
                    variant="outline"
                    size="sm"
                    className="profile-info gap-2 bg-transparent"
                  >
                    <Edit2 className="w-4 h-4" /> Edit Profile
                  </Button>
                </Link>
              </div>

              <p className="profile-info text-muted-foreground mb-4 max-w-lg">
                {profile?.dev_type || "No type yet"}
              </p>

              <div className="profile-info flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{profile?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{profile?.updated_at || "Location not set"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined January 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stats-card glass-card rounded-xl p-6 text-center hover:glow-border transition-all duration-300"
            >
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Skills Carousel */}
        <div className="skills-section glass-card rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Skills & Expertise</h2>
          <InfiniteSkillsCarousel skills={profile?.skills || []} />
        </div>
      </div>
    </div>
  );
}
