import { BellIcon, HomeIcon, UserIcon, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, UserButton, SignOutButton } from "@clerk/nextjs";
import ModeToggle from "./ModeToggle";
import { currentUser } from "@clerk/nextjs/server";
import { getUserRoleByClerkId } from "@/actions/user.action";

export default async function DesktopNavbar() {
  const user = await currentUser();
  const dbUserRole = await getUserRoleByClerkId();

  return (
    <div className="hidden md:flex items-center space-x-4">
      {user ? (
        <>
          {dbUserRole === "ADMIN" ? (
            <>
              <Button variant="ghost" className="flex items-center gap-2" asChild>
                <Link href="/notifications">
                  <BellIcon className="w-4 h-4" />
                  <span className="hidden lg:inline">Notifications</span>
                </Link>
              </Button>
              <Button variant="ghost" className="flex items-center gap-2" asChild>
                <Link href={`/profile/${user.username ?? user.emailAddresses[0].emailAddress.split("@")[0]}`}>
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden lg:inline">Profile</span>
                </Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <p className="hidden lg:inline md:inline">Hello, {user.firstName}</p>
              <SignOutButton>
                <Button variant="ghost" className="flex items-center gap-3 justify-start">
                  <LogOutIcon className="w-4 h-4" />
                  Logout
                </Button>
              </SignOutButton>
            </>
          )}
        </>
      ) : (
        <SignInButton mode="modal" afterSignInPath="/" afterSignUpPath="/">
          <Button variant="default">Sign In</Button>
        </SignInButton>
      )}

      <ModeToggle />
    </div>
  )
}