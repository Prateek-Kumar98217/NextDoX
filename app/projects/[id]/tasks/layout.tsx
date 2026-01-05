"use client";

import { DndContext } from "@dnd-kit/core";

export default function TasksLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      <DndContext>{children}</DndContext>
    </main>
  );
}
