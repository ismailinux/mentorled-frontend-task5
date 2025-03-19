import { NextResponse } from "next/server";

interface Interview {
  id: string;
  title: string;
  description: string;
  questions: string[];
  dateCreated: string;
}

interface InterviewInput {
  title: string;
  description: string;
  questions: string[];
  dateCreated: string;
}

const mockInterviews: Interview[] = []; 

export async function POST(request: Request) {
  const interviewData = await request.json() as InterviewInput;

  const newInterview: Interview = {
    id: Date.now().toString(), 
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