'use client';
import React from 'react'
import Image from 'next/image'
import ReactWebcam from 'react-webcam'
import { Button } from '@/components/ui/button';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { Mic, MicIcon } from 'lucide-react';
import { toast } from 'sonner';
// import { ChatSession } from '@google/generative-ai';
import { GoogleGenAI } from '@google/generative-ai';
import { ChatSession } from '@/utils/GeminiAIModal';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import moment from 'moment';


function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [isActive, setIsActive] = React.useState(false)
  const [results, setResults] = React.useState('')
  const [userAnswer, setUserAnswer] = React.useState('')
  const { user } = useUser()
  const [loading, setLoading] = React.useState(false)
  const SaveUserAnswer = async () => {
    if (listening) {
      setLoading(true)
      SpeechRecognition.stopListening()
      if (userAnswer?.length < 10) {
        setLoading(false)
        toast('Answer is too short')
        return
      }
      const feedbackPrompt = 'Question: ' + mockInterviewQuestion[activeQuestionIndex]?.question + 'User Answer:' + userAnswer + ' Depends on question and answer for given interview question provide rating for the answer between 1 to 10 and provide feedback as areas of improvement if any ,give the feedback in 3-4 lines in JSON format as feedback: {rating: number, feedback: string} return only the JSON object not the other text';

      const chatSession = new ChatSession();
      const feedback = await chatSession.sendMessage(feedbackPrompt);
      toast.success('Feedback saved');
      const mockJsonResp = feedback.replace('```json', '').replace('```', '').trim(); // feedback is already the response string
      console.log('Feedback response:', mockJsonResp);

      const JsonFeedbackResp = JSON.parse(mockJsonResp);
      console.log('Parsed feedback:', JsonFeedbackResp);
      const userAnswerData = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      })
      if (userAnswerData) {
        toast.success('User answer saved successfully');
      }
      setUserAnswer('')
      setLoading(false)
    }
    else {
      SpeechRecognition.startListening({
        continuous: true,
        interimResults: true
      })
    }
  }

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const startListening = () => {
    SpeechRecognition.startListening({
      continuous: true,
      interimResults: true
    });
  };

  // Store transcript in results
  React.useEffect(() => {
    if (transcript) {
      setResults(transcript)
      setUserAnswer(transcript)
    }
  }, [transcript, results]);


  return (
    <div className='flex flex-col items-center justify-center mt-2'>
      <div className='frosted-card relative flex flex-col items-center justify-center rounded-xl p-6 size-100'>
        {!isActive && (
          <Image
            src={'/webcam.png'}
            alt="Activate webcam"
            width={200}
            height={200}
            className='cursor-pointer'
            onClick={() => setIsActive(true)}
          />
        )}
        {isActive && (
          <ReactWebcam
            mirrored
            style={{ width: '100%', height: '100%', borderRadius: '0.75rem' }}
          />
        )}
      </div>
      <div>
        <p className='text-white mt-1 font-semibold'>Click to activate webcam</p>
      </div>
      <div className='flex flex-col md:flex-row gap-4 mt-4 w-full items-start'>
        <div className='flex flex-col gap-2 ml-14 '>
          <Button
            variant="outline"
            className='frosted-button-dark w-40 border-white/20 hover:bg-white/20'
            onClick={SaveUserAnswer}
          >
            {listening ? 'Stop Recording' : 'Start Recording'}
          </Button>
          <Button variant="outline" className='frosted-button-dark w-40 border-white/20 hover:bg-white/20' onClick={() => {
            resetTranscript();
            setUserAnswer('');
          }}>Reset</Button>
          <p className='text-white text-sm font-semibold text-center'>Microphone: {listening ? 'on' : 'off'}</p>
        </div>
        <div className='frosted-glass rounded-lg p-3 flex-1 md:ml-4 md:mr-14'>
          <p className='text-white font-semibold mb-2'>Live Transcript:</p>
          <p className='text-gray-300'>{transcript || 'Your speech will appear here...'}</p>
        </div>
      </div>
    </div>
  );
}

export default RecordAnswerSection;
