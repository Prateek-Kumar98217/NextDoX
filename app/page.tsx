import AuthButton from "@/components/auth/button";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center max-w-full">
      <AuthButton />
      <h1>Welcome to NextDoX</h1>
      <p>
        Your one stop solution to project management and planning for solo devs
      </p>
    </main>
  );
}
