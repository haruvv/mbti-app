import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white p-4">
      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              rootBox: "shadow-xl rounded-xl overflow-hidden",
              card: "bg-white p-8",
              headerTitle: "text-2xl font-bold text-gray-800",
              headerSubtitle: "text-gray-600",
              formButtonPrimary: "bg-slate-600 hover:bg-slate-700 text-white",
              footerAction: "text-gray-600",
              formFieldInput: "rounded-lg border-gray-300",
            },
          }}
        />
      </div>
    </div>
  );
}
