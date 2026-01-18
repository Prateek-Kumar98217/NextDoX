interface InfiniteSkillsCarouselProps {
  skills: string[];
}

export function InfiniteSkillsCarousel({
  skills,
}: InfiniteSkillsCarouselProps) {
  // Duplicate skills for seamless loop
  const duplicatedSkills = [...skills, ...skills];

  return (
    <div className="overflow-hidden relative">
      <div className="flex gap-4 py-4">
        {duplicatedSkills.map((skill, index) => (
          <div
            key={`${skill}-${index}`}
            className="shrink-0 px-6 py-3 glass rounded-full border border-border/50 hover:border-primary/50 hover:glow-border transition-all duration-300 cursor-default"
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
