import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

function page() {
  return (
    <div className="flex flex-row items-center justify-center">
      <div className="rounded-lg overflow-hidden">
        <img src="/avatar.jpg" alt="Avatar" className="w-full h-auto object-cover" />
      </div>
      <div className="w-80">
        <SignInButton mode="modal">
          <Button className="w-full" variant="outline">
            Login
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button className="w-full mt-2" variant="default">
            Sign Up
          </Button>
        </SignUpButton>
      </div>
    </div>
  )
}

export default page;