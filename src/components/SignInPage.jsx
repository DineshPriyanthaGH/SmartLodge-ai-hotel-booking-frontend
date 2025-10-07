import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <SignIn 
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          redirectUrl="/"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-black hover:bg-gray-800 text-sm normal-case',
              card: 'shadow-lg',
            },
          }}
        />
      </div>
    </div>
  )
}