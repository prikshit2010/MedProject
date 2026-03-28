import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div className="glass p-8 rounded-3xl relative overflow-hidden">
        <SignIn appearance={{ elements: { rootBox: "mx-auto" } }} />
      </div>
    </div>
  );
}
