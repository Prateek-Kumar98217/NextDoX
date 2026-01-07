"use client";

import { ProfileDisplay } from "@/components/profile/display";
import { ProfileUpdateForm } from "@/components/profile/update-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ProfilePage() {
  const [update, setUpdate] = useState(false);
  const handleClick = () => {
    setUpdate((prev) => !prev);
  };

  return (
    <main>
      <Button onClick={handleClick}>Toggle mode</Button>
      {update ? <ProfileUpdateForm /> : <ProfileDisplay />}
    </main>
  );
}
