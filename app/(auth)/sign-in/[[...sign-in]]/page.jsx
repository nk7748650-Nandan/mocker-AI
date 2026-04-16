import { SignIn } from '@clerk/nextjs'
import LightRays from '@/components/LightRays'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-black">
      <LightRays 
        raysOrigin="top-center"
        raysColor="#f59e0b"
        raysSpeed={0.8}
        lightSpread={0.3}
        rayLength={2.2}
        pulsating={true}
        fadeDistance={1.2}
        saturation={1.0}
        followMouse={true}
        mouseInfluence={0.05}
        noiseAmount={0.02}
        distortion={0.0}
        className="auth-light-rays"
      />
      <div className="relative z-10 flex items-center justify-center bg-black">
        <SignIn className='text-black bg-white' appearance={{ elements: { rootBox: 'w-full max-w-md text-white' } }} />
      </div>
    </div>
  )
}