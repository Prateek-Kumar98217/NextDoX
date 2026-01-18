"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useAuth } from "@/contexts/auth-context";
import { ArrowRight, Zap, Shield, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPageContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from(".hero-title", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".hero-subtitle", {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
      });

      gsap.from(".hero-buttons", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: "power3.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Optimized performance for seamless project management experience",
    },
    {
      icon: Shield,
      title: "Secure by Default",
      description: "Enterprise-grade security to protect your sensitive data",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Real-time collaboration tools for distributed teams",
    },
  ];

  return (
    <div ref={heroRef} className="min-h-screen relative overflow-hidden">
      <header className="relative z-10 px-6 py-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold">NextDoX</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                Login
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="gap-2 glow-border">
                Get Started <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>
      <section className="relative z-10 px-6 pt-20 pb-32 lg:pt-32">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="hero-title text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Manage Projects</span>
            <br />
            <span className="text-primary text-glow">Like Never Before</span>
          </h1>
          <p className="hero-subtitle text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
            Streamline your workflow with our intuitive project management
            platform. Track tasks, collaborate with your team, and deliver
            results faster.
          </p>
          <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="gap-2 px-8 glow-border">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 px-8 border-border hover:bg-secondary bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <section ref={featuresRef} className="relative z-10 px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card glass-card p-8 rounded-2xl hover:glow-border transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="relative z-10 px-6 py-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
          <p>© 2026 NextDoX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
