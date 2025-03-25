import { getPosts } from "@/actions/post.action";
import { getDbUserId, getUserRoleByClerkId } from "@/actions/user.action";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  const posts = await getPosts();
  const dbUserId = await getDbUserId();
  const dbUserRole = await getUserRoleByClerkId();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-10">
        {user && dbUserRole == 'ADMIN' ? <CreatePost /> : null}

        {/* Hero Section on small screen */}
        <div className="lg:hidden md:w-1/2 mx-auto">
          <Card>
            <div className="rounded-lg overflow-hidden">
              <img src="/avatar.jpg" alt="Avatar" className="w-full h-auto object-cover" />
            </div>
            <CardHeader>
              <CardTitle className="text-center text-xl font-semibold">Hi, I'm KC</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground mb-4">
                Welcome to my art gallery. Please enjoy your stay!
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} dbUserId={dbUserId} />
          ))}
        </div>
      </div>
    </div>
  );
}
