import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">Interview Creator</h1>
      <p className="mt-4 text-gray-600">Create and manage interviews easily.</p>
      <div className="mt-4 space-x-4">
        <Button asChild className="bg-green-600 text-white">
          <Link href="/create">Create Interview</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/interviews">View All Interviews</Link>
        </Button>
      </div>
    </div>
  );
}