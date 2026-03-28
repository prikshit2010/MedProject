import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div className="glass p-8 rounded-3xl relative overflow-hidden">
        <SignUp appearance={{ elements: { rootBox: "mx-auto" } }} />
      </div>
    </div>
  );
}
