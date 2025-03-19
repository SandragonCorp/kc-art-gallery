import { getProfileByUsername, getUserPosts, c, getUserLikedPosts, isFollowing } from "@/actions/profile.actions"
import { notFound } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";

export async function generateMetadata({params}) {
  const user = await getProfileByUsername(params.username);
  if(!user) return

  return {
    title: `${user.name ?? user.username}`,
    description: user.bio || `Check out ${user.username}'s profile`,
  }
}

async function ProfilePageServer({params}) {
  const user = await getProfileByUsername(params.username);
  if(!user) return notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return <ProfilePageClient
    user = {user}
    posts = {posts}
    likedPosts = {likedPosts}
    isFollowing = {isCurrentUserFollowing}
  />
}

export default ProfilePageServer