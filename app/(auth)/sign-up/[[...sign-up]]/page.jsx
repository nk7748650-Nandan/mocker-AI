import { SignUp } from '@clerk/nextjs'
import LightRays from '@/components/LightRays'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-black">
      <LightRays 
        raysOrigin="top-right"
        raysColor="#10b981"
        raysSpeed={1.1}
        lightSpread={0.3}
        rayLength={1.8}
        pulsating={true}
        fadeDistance={0.9}
        saturation={1.1}
        followMouse={true}
        mouseInfluence={0.05}
        noiseAmount={0.02}
        distortion={0.0}
        className="auth-light-rays"
      />
      <div className="relative z-10 flex items-center justify-center">
        <SignUp appearance={{ elements: { rootBox: 'w-full max-w-md' } }} />
      </div>
    </div>
  )
}