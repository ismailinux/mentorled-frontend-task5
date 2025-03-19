// app/candidate/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Interview {
  id: string;
  title: string;
  description: string;
  questions: string[];
  dateCreated: string;
}

export default function CandidateInterviewPage() {
  const [interview, setInterview] = useState<Interview | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answer, setAnswer] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams ? searchParams.get("id") : null; // Fallback for SSR

  useEffect(() => {
    if (id) {
      const fetchInterview = async () => {
        try {
          const response = await fetch(`/api/interviews?id=${id}`);
          if (response.ok) {
            const data = await response.json();
            const foundInterview = data.find((i: Interview) => i.id === id);
            if (foundInterview) {
              setInterview(foundInterview);
            } else {
              console.error("Interview not found");
            }
          }
        } catch (error) {
          console.error("Error fetching interview:", error);
        }
      };
      fetchInterview();
    } else {
      // Redirect to /interviews if no id is provided
      router.push("/interviews");
    }
  }, [id, router]);

  useEffect(() => {
    if (timeLeft > 0 && interview && currentQuestionIndex < interview.questions.length) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, interview, currentQuestionIndex]);

  const handleNext = () => {
    if (interview && currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(30);
      setAnswer("");
    } else {
      router.push("/interviews");
    }
  };

  const handleSubmit = () => {
    console.log("Answer submitted:", answer);
  };

  if (!id) {
    return <div className="p-6 bg-gray-50 min-h-screen">Redirecting...</div>;
  }

  if (!interview) {
    return <div className="p-6 bg-gray-50 min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Button
        variant="outline"
        onClick={() => router.push("/interviews")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Interviews
      </Button>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Candidate Interview: {interview.title}</h1>
      <div className="mb-4">
        <p className="text-lg">Time Left: {timeLeft} seconds</p>
      </div>
      {interview.questions.length > 0 && (
        <div className="mb-6">
          <p className="text-xl mb-4">{interview.questions[currentQuestionIndex]}</p>
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-1/2 h-40"
            disabled={timeLeft === 0}
          />
        </div>
      )}
      <div className="space-x-4">
        <Button
          onClick={handleSubmit}
          className={timeLeft === 0 ? "bg-red-600 text-white" : "bg-green-600 text-white"}
          disabled={timeLeft === 0}
        >
          {timeLeft === 0 && <Lock className="mr-2 h-4 w-4" />}
          Submit
        </Button>
        <Button
          onClick={handleNext}
          className="bg-green-600 text-white"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

// Disable prerendering for this page
export const dynamic = "force-dynamic";