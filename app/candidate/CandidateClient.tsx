// app/candidate/CandidateClient.tsx23
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Lock, Video, VideoOff, Play } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Interview {
  id: string;
  title: string;
  description: string;
  questions: string[];
  dateCreated: string;
}

export default function CandidateClient() {
  const [interview, setInterview] = useState<Interview | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams ? searchParams.get("id") : null;

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      recordedChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        setRecordedVideo(blob);
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        // Stop all tracks to release the camera and microphone
        stream.getTracks().forEach((track) => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playVideo = () => {
    if (videoRef.current && videoUrl) {
      videoRef.current.src = videoUrl;
      videoRef.current.play();
    }
  };

  const handleNext = () => {
    if (interview && currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(30);
      setAnswer("");
      setRecordedVideo(null);
      setVideoUrl(null);
      recordedChunksRef.current = [];
    } else {
      router.push("/interviews");
    }
  };

  const handleSubmit = () => {
    console.log("Answer submitted:", { text: answer, video: recordedVideo });
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  if (!id) {
    return <div className="p-6 bg-gray-50 min-h-screen">Redirecting...</div>;
  }

  if (!interview) {
    return <div className="p-6 bg-gray-50 min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full p-6 rounded-lg shadow-lg bg-white">
        <Button
          variant="outline"
          onClick={() => router.push("/interviews")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Interviews
        </Button>
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Candidate Interview: {interview.title}</h1>
        <div className="mb-4 text-center">
          <p className="text-lg">Time Left: {timeLeft} seconds</p>
        </div>
        {interview.questions.length > 0 && (
          <div className="mb-6">
            <p className="text-xl mb-4 text-center">{interview.questions[currentQuestionIndex]}</p>
            <div className="flex flex-col md:flex-row gap-6 mb-4">
              {/* <div className="w-full md:w-1/2">
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full h-40"
                  disabled={timeLeft === 0}
                />
              </div> */}
              <div className="w-full">
                <video
                  ref={videoRef}
                  className="w-full h-70 mx-auto bg-black rounded-lg -scale-x-100"
                  muted={isRecording}
                  playsInline
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <Button
                onClick={startRecording}
                disabled={isRecording || timeLeft === 0}
                className="bg-blue-600 text-white"
              >
                <Video className="mr-2 h-4 w-4" /> Start Recording
              </Button>
              <Button
                onClick={stopRecording}
                disabled={!isRecording || timeLeft === 0}
                className="bg-red-600 text-white"
              >
                <VideoOff className="mr-2 h-4 w-4" /> Stop Recording
              </Button>
              <Button
                onClick={playVideo}
                // disabled={!recordedVideo || timeLeft === 0}
                className="bg-purple-600 text-white"
              >
                <Play className="mr-2 h-4 w-4" /> Play Video
              </Button>
            </div>
          </div>
        )}
        <div className="flex justify-center gap-4">
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
    </div>
  );
}