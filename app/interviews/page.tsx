"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Interview {
  id: string;
  title: string;
  description: string;
  questions: string[];
  dateCreated: string;
}

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch("/api/interviews");
        if (response.ok) {
          const data = await response.json();
          setInterviews(data);
        } else {
          console.error("Failed to fetch interviews");
        }
      } catch (error) {
        console.error("Error fetching interviews:", error);
      }
    };

    fetchInterviews();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Button variant="outline" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>
        <Button onClick={() => router.push("/create")} className="bg-green-600 text-white">
          Create Interview
        </Button>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">All Interviews</h1>
      {interviews.length === 0 ? (
        <p className="text-gray-600">No interviews found. Create one to get started!</p>
      ) : (
        <div className="rounded-lg border bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left p-4">Title</TableHead>
                <TableHead className="text-left p-4">Description</TableHead>
                <TableHead className="text-left p-4">Questions</TableHead>
                <TableHead className="text-left p-4">Date Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interviews.map((interview) => (
                <TableRow key={interview.id} className="hover:bg-muted/30">
                  <TableCell className="p-4">{interview.title}</TableCell>
                  <TableCell className="p-4">{interview.description}</TableCell>
                  <TableCell className="p-4">
                  {interview.questions.map((q, index) => (
                    <div key={index}> {q} </div>
                  ))}
                  </TableCell>
                  <TableCell className="p-4">
                    {new Date(interview.dateCreated).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}