"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function CreateInterviewPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([""]);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const interviewData = {
      title,
      description,
      questions,
      dateCreated: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interviewData),
      });

      if (response.ok) {
        setSuccessMessage("Interview created successfully!");
        setTitle("");
        setDescription("");
        setQuestions([""]);
        setTimeout(() => {
          setSuccessMessage("");
          router.push("/");
        }, 2000);
      } else {
        setSuccessMessage("Failed to create interview.");
      }
    } catch {
      setSuccessMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Button
        variant="outline"
        onClick={() => router.push("/")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Button>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Create New Interview</h1>
      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Questions</label>
          {questions.map((question, index) => (
            <Input
              key={index}
              type="text"
              value={question}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              className="mt-1 mb-2"
              placeholder={`Question ${index + 1}`}
            />
          ))}
          <Button type="button" onClick={addQuestion} className="mt-2">
            Add Question
          </Button>
        </div>
        <Button type="submit" className="bg-green-600 text-white">
          Create Interview
        </Button>
      </form>
    </div>
  );
}