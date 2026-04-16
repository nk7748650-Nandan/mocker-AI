'use client'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDownIcon, ChevronFirstIcon, ChevronsUpDown, ChevronsUpDownIcon, ChevronUpCircleIcon } from 'lucide-react'
import { ShinyText } from '@/components/ui/shiny-text'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

function Feedback({params}) {
  const [feedbackList, setFeedbackList] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)
  const router=useRouter()

  const resolvedParams = React.use(params)
  
  const GetFeedback = async () => {
        const result=await db.select().from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef,resolvedParams.interviewID))
      .orderBy(UserAnswer.id)

      console.log(result)
      setFeedbackList(result)
      
      if (result && result.length > 0) {
        const totalRating = result.reduce((sum, item) => {
          const rating = parseFloat(item.rating) || 0
          return sum + rating
        }, 0)
        const average = totalRating / result.length
        setAverageRating(Math.round(average * 10) / 10) // Round to 1 decimal place
      }

  }

  const handleGoToDashboard = () => {
    setIsNavigating(true)
    router.push('/dashboard')
  }
  useEffect(() => {
    if (resolvedParams?.interviewID) {
      GetFeedback()
    }
  }, [resolvedParams?.interviewID])
  return (
    <div className='p-10 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800'>
      <div className='frosted-card rounded-2xl p-8 mb-8'>
        <h2 className='text-4xl font-bold text-green-400 text-center mb-4'><ShinyText variant="gold">Congratulations!</ShinyText></h2>
        <h2 className='font-bold text-2xl my-2 text-white text-center'>Here is your feedback for the interview.</h2>
      </div>
      
       {feedbackList?.length==0?
       <div className='frosted-glass rounded-xl p-8 text-center'>
         <h2 className='text-gray-300 font-bold text-xl'>No feedback found</h2>
       </div>
       :
       <>
       <div className='frosted-card rounded-xl p-6 mb-8'>
         <h2 className='text-xl my-2 text-blue-400 font-bold text-center'>Your overall rating : <strong className='text-yellow-400'>{averageRating}/10</strong></h2>
         <h2 className='text-gray-300 text-center'>Find below the interview questions with correct answers and your answers with feedback for improvement.</h2>
       </div>
       
      {feedbackList&&feedbackList.map((item,index)=>(
      <Collapsible key={index}>
  <CollapsibleTrigger className='frosted-card p-6 rounded-2xl my-4 text-left flex justify-between items-center hover:shadow-2xl transition-all duration-300 cursor-pointer group'>
    <div className='flex items-center gap-4'>
      <div className='bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold shadow-lg'>
        {index + 1}
      </div>
      <span className='text-white font-medium group-hover:text-blue-300 transition-colors text-lg'>
        {item.question}
      </span>
    </div>
    <ChevronsUpDownIcon className='h-6 w-6 text-gray-400 group-hover:text-blue-400 transition-colors'/>
  </CollapsibleTrigger>
  <CollapsibleContent>  
  <div className='frosted-glass rounded-xl p-6 mt-4'>
  <h2 className='text-lg text-blue-400 mb-4'>Rating : <strong className='text-yellow-400'>{item.rating}/10</strong></h2>
  <div className='frosted-glass-dark rounded-lg p-4 mb-4'>
    <strong className='text-red-300 text-lg pr-2'>Your Answer : </strong>
    <span className='text-red-200 text-semibold font-medium'>{item.userAns}</span>
  </div>
  <div className='frosted-glass-dark rounded-lg p-4 mb-4 '>
    <strong className='text-yellow-300 text-lg pr-2'>Feedback : </strong>
    <span className='text-yellow-200 text-semibold font-medium'>{item.feedback}</span>
  </div>
  <div className='frosted-glass-dark rounded-lg p-4 '>
    <strong className='text-green-300 text-lg pr-2'>Correct Answer : </strong>
    <span className='text-green-200 text-semibold font-medium'>{item.correctAns}</span>
  </div>
    </div>
  </CollapsibleContent>
</Collapsible>
      ))}
      </>}
        <div className='text-center mt-8'>
          <Button 
            className='frosted-button-white px-8 py-3 text-lg font-semibold border-black/2 hover:bg-white/20 transition-all duration-300' 
            onClick={handleGoToDashboard}
            disabled={isNavigating}
          >
            {isNavigating ? 'Loading...' : 'Go to Dashboard'}
          </Button>
        </div>
      </div>
  )
}

export default Feedback