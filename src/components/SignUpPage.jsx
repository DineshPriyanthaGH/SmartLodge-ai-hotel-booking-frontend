import { SignUp } from '@clerk/clerk-react'

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <SignUp 
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
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