//testing home page with kanban board
"use client"
import { TestBoard } from "@/components/test-board";

export default function Home() {
  return (
    <main className="w-full h-full flex-col items-center justify-center">
      <h1>Welcome to the Home Page</h1>
      <TestBoard />
    </main>
  )
}