import { UserProfile } from '@clerk/clerk-react'

export default function UserProfilePage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-4xl">
        <UserProfile 
          routing="path"
          path="/user-profile"
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