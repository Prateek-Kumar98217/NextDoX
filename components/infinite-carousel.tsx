"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface InfiniteSkillsCarouselProps {
  skills: string[];
}

export function InfiniteSkillsCarousel({
  skills,
}: InfiniteSkillsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;

    const track = trackRef.current;
    const trackWidth = track.scrollWidth / 2;

    gsap.to(track, {
      x: -trackWidth,
      duration: 30,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => Number.parseFloat(x) % trackWidth),
      },
    });
  }, [skills]);

  // Duplicate skills for seamless loop
  const duplicatedSkills = [...skills, ...skills];

  return (
    <div ref={containerRef} className="overflow-hidden relative">
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-card to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-card to-transparent z-10" />

      <div ref={trackRef} className="flex gap-4 py-4">
        {duplicatedSkills.map((skill, index) => (
          <div
            key={`${skill}-${index}`}
            className="flex-shrink-0 px-6 py-3 glass rounded-full border border-border/50 hover:border-primary/50 hover:glow-border transition-all duration-300 cursor-default"
          >
            <span className="text-sm font-medium text-foreground whitespace-nowrap">
              {skill}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
