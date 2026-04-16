import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Header from './_components/Header'
import LightRays from '@/components/LightRays'

async function DashboardLayout({children}) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className='min-h-screen bg-black relative'>
      <LightRays 
        raysOrigin="top-center"
        raysColor="white"
        raysSpeed={0.2}
        lightSpread={4.3}
        rayLength={1.5}
        pulsating={true}
        fadeDistance={0.}
        saturation={2.2}
        followMouse={true}
        mouseInfluence={0.5}
        noiseAmount={0.02}
        distortion={0.0}
        className="dashboard-light-rays"
      />
      <div className="relative z-10">
        <Header/>
        <div className='mx-5 md:mx-20 lg:mx-36 py-8'>
          {children}
        </div>
      </div>
    </div>
  )
}
export default DashboardLayout
