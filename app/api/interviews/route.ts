import { NextResponse } from "next/server";

// Define the Interview interface
interface Interview {
  id: string;
  title: string;
  description: string;
  questions: string[];
  dateCreated: string;
}

// Define the input data interface (without id, since it's server-generated)
interface InterviewInput {
  title: string;
  description: string;
  questions: string[];
  dateCreated: string;
}

const mockInterviews: Interview[] = []; // Typed array with const

export async function POST(request: Request) {
  const interviewData = await request.json() as InterviewInput;

  const newInterview: Interview = {
    id: Date.now().toString(), // Unique ID generated server-side
    title: interviewData.title,
    description: interviewData.description,
    questions: interviewData.questions,
    dateCreated: interviewData.dateCreated,
  };

  mockInterviews.push(newInterview);

  return NextResponse.json({ message: "Interview created", data: newInterview }, { status: 201 });
}

export async function GET() {
  return NextResponse.json(mockInterviews);
}