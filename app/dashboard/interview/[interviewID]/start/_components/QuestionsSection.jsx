import { Lightbulb, Volume2Icon } from 'lucide-react'
import React from 'react'

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex }) {

  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(speech)
    }
    else {
      alert('Speech synthesis not supported in this browser')
    }
  }
  return mockInterviewQuestion && (
    <div className='p-4 border rounded-xl'>
      <div className=' grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 flex flex-col gap-5 my-5'>
        {Array.isArray(mockInterviewQuestion) && mockInterviewQuestion.map((question, index) => (
          <h2 key={question?.id ?? question?.uuid ?? question?.question ?? index}
            className={`p-2 font-bold bg-orange-100 rounded-lg text-center text-xs md:text-sm cursor-pointer text-gray-400
                ${activeQuestionIndex == index && 'bg-orange-500 text-white'}`}>
            Question {index + 1}
          </h2>
        ))}
      </div>
      <h2 className='text-md md:text-lg mx-2 my-2 font-semibold'>{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>
      <div className='flex items-center gap-2'>
        <Volume2Icon className='cursor-pointer text-orange-500 ml-3 mt-3' onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}></Volume2Icon>
        <h2 className='text-orange-500 text-semibold font-medium mt-2'>Click once to hear the question</h2>
      </div>
      <div className='mx-1 my-2 border-2 border-yellow-500 rounded-lg p-2 bg-yellow-50 mt-30'>
        <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb />
          <strong>:</strong>
        </h2>
        <h2 className="text-semibold font-medium md:text-sm my-2 mx-1 text-yellow-500 ">
          Click on record when you want to answer . At the end of the inteview the feedback will be provided.
        </h2>
      </div>
    </div>
  );
}

export default QuestionsSection;