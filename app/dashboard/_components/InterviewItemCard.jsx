'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview, UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'

function InterviewItemCard({ interview, onDelete }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const onStart = () => {
    router.push(`/dashboard/interview/${interview.mockId}`)
  }
  const onFeedback = () => {
    router.push(`/dashboard/interview/${interview.mockId}/feedback`)
  }

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this interview? This action cannot be undone.')

    if (!confirmed) return

    try {
      setIsDeleting(true)

      // Delete associated user answers first
      await db.delete(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, interview.mockId))

      // Delete the interview
      await db.delete(MockInterview)
        .where(eq(MockInterview.mockId, interview.mockId))

      toast.success('Interview deleted successfully')

      // Call the onDelete callback to refresh the list
      if (onDelete) {
        onDelete()
      }
    } catch (error) {
      console.error('Error deleting interview:', error)
      toast.error('Failed to delete interview')
    } finally {
      setIsDeleting(false)
    }
  }


  return (
    <div className='frosted-card rounded-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 text-white relative'>
      <Button
        variant='ghost'
        size='icon'
        className='absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-500/10'
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className='h-4 w-4' />
      </Button>

      <h2 className='text-lg font-bold text-white mb-2 pr-8'>Position: {interview?.jobPosition}</h2>
      <h3 className='text-sm text-gray-300 font-semibold mb-2'>Experience: {interview?.jobExperience}</h3>
      <h3 className='text-xs text-gray-400'>Created: {interview?.createdAt}</h3>
      <div className='flex gap-2 mt-3'>
        <Button className='flex-1 cursor-pointer frosted-button-dark border-white/20 hover:bg-white/20' variant='outline' onClick={onFeedback}>View Interview</Button>
        <Button className='flex-1 cursor-pointer frosted-button-dark border-white/20 hover:bg-white/20' onClick={onStart}>Re-take Interview</Button>
      </div>
    </div>
  )
}

export default InterviewItemCard