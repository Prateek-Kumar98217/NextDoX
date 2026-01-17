"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

import { items } from "@/lib/side-bar";

export function AppSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { signOut } = useAuth();

  useEffect(() => {
    if (sidebarRef.current && contentRef.current) {
      gsap.to(sidebarRef.current, {
        width: isExpanded ? 240 : 72,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(contentRef.current.querySelectorAll(".nav-label"), {
        opacity: isExpanded ? 1 : 0,
        x: isExpanded ? 0 : -10,
        duration: 0.2,
        stagger: 0.03,
        ease: "power2.out",
      });
    }
  }, [isExpanded]);

  return (
    <div
      ref={sidebarRef}
      className="fixed left-0 top-0 h-screen w-18 glass-card z-50 flex flex-col py-6 overflow-hidden"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div ref={contentRef} className="flex flex-col h-full">
        {/* Logo */}
        <div className="px-4 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-lg">N</span>
          </div>
          <span className="nav-label text-lg font-semibold text-foreground whitespace-nowrap opacity-0">
            NextDoX
          </span>
        </div>

        <nav className="flex-1 px-3 space-y-2">
          {items.map((item) => {
            const isActive = pathname === item.url;
            return (
              <Link
                key={item.url}
                href={item.url}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-primary text-primary-foreground glow-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="nav-label whitespace-nowrap opacity-0">
                  {item.title}
                </span>
                {isActive && (
                  <ChevronRight className="nav-label ml-auto w-4 h-4 opacity-0" />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-3 rounded-xl w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="nav-label whitespace-nowrap opacity-0">Logout</span>
        </button>
      </div>
    </div>
  );
}
