//testing home page with user sign in and sign out and data access from the OAuth signin

import SignIn from "@/components/sign-in"
import SignOut from "@/components/sign-out"
import { addUser, getUserByEmail } from "@/actions/userActions";
import { auth } from "@/auth"

export default async function Home() {
  const session = await auth();
  if (session?.user) {
      await addUser({
      name: session.user.name || "No Name",
      email: session.user.email || "No Email",
    });
    const user = await getUserByEmail(session.user.email || "No Email");
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>Welcome, {user.name}</h1>
        <SignOut />
      </main>
    )
  }else{
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <SignIn />
      </main>
    )
  }
}