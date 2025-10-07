import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <SignUp 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-white shadow-xl rounded-2xl border-0 p-8",
              headerTitle: "text-2xl font-bold text-gray-900",
              headerSubtitle: "text-gray-600 mt-2",
              socialButtonsBlockButton: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg",
              socialButtonsBlockButtonText: "font-medium",
              dividerLine: "bg-gray-200",
              dividerText: "text-gray-500 text-sm",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium py-3",
              formFieldInput: "rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500",
              formFieldLabel: "text-gray-700 font-medium",
              identityPreviewText: "text-gray-600",
              identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
              footerActionText: "text-gray-600",
              footerActionLink: "text-blue-600 hover:text-blue-700 font-medium"
            }
          }}
          redirectUrl="/dashboard"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
}