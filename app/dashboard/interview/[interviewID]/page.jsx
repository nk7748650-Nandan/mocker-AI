'use client'
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { ArrowLeftCircleIcon, CheckCircleIcon, LeafyGreenIcon, PlayIcon, WebcamIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import Link from 'next/link'

function Interview({ params }) {
  const Params = React.use(params)
  const [interviewData, setInterviewData] = useState()
  const [webCamEnabled, setWebCamEnabled] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log(Params.interviewID)
    GetInterviewDetails()
  }, [])
  /* Used to Get Interview Details by MockId /InterviewID*/
  const GetInterviewDetails = async () => {
    const result = await db.select().from(MockInterview)
      .where(eq(MockInterview.mockId, Params.interviewID))
    setInterviewData(result[0])
  }
  return (
    <div className='my-6 '>
      <h2 className='text-2xl font-bold flex col items-center justify-center'>
        Lets get started
      </h2>
      <div className='grid grid-col-1 md:grid-cols-2 '>
        <div className='p-10 rounded-lg shadow-md my-10 h-68'>
          <h2 className='h-5 my-3'><strong>Job Role:</strong> {interviewData?.jobPosition}</h2>
          <h2 className='h-5 my-3'><strong>Description of Job:</strong> {interviewData?.jobDesc}</h2>
          <h2 className='h-5 my-3'><strong>Years of Experience:</strong> {interviewData?.jobExperience}</h2>
        </div>
        <div className='flex items-center justify-center'>
          {webCamEnabled ? (
            <div>
              <Webcam
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                mirrored={true}
                style={{ width: '400px', height: '400px' }}
              />
              <Button className='w-full my-2' onClick={() => setWebCamEnabled(false)}> Disable Web Cam and Mic</Button>
            </div>
          ) : (
            <div>
              <WebcamIcon className='h-72 w-130 my-7 border-2 bg-gray-100 rounded-lg border  ' />
              <Button className='w-full' onClick={() => setWebCamEnabled(true)}> Enable Web Cam and Mic</Button>
            </div>
          )}
        </div>
        <div>
          {webCamEnabled === false && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle >Camera is off</AlertTitle>
              <AlertDescription>
                You can turn on your camera for a better experience, or start directly.
                <Link href={`/dashboard/interview/${Params.interviewID}/start`}>
                  <Button className='w-full my-2' variant="outline" onClick={() => setLoading(true)} disabled={loading}>
                    {loading ? 'Starting...' : 'Start Interview Without Camera'}
                  </Button>
                </Link>
              </AlertDescription>
            </Alert>
          )}
          {webCamEnabled === true && (
            <Alert variant="default">
              <CheckCircleIcon />
              <AlertTitle>Good Job! Look at the preview and start  interview</AlertTitle>
              <Link href={`/dashboard/interview/${Params.interviewID}/start`}>
                <Button className='w-135 my-2' onClick={() => setLoading(true)} disabled={loading}>
                  {loading ? 'Starting...' : 'Start Interview'}
                </Button>
              </Link>
            </Alert>
          )}
        </div>

      </div>

    </div>
  )
}

export default Interview