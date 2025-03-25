import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

async function Sidebar() {
  return (
    <div className="sticky top-20">
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
  )
}

export default Sidebar