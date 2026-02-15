import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'Clippay - Marketing that pays for itself'
export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b', // zinc-950
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Background Gradients */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(29,225,185,0.15) 0%, rgba(9,9,11,0) 70%)',
            filter: 'blur(80px)', 
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(225,29,72,0.15) 0%, rgba(9,9,11,0) 70%)',
            filter: 'blur(80px)',
            borderRadius: '50%',
          }}
        />

        {/* Content Container */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            zIndex: 10,
          }}
        >
          {/* Logo / Brand Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Simple Geometric Logo - Play Button Shape with Gradient */}
            <div 
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #1DE1B9 0%, #E11D48 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 50px rgba(29,225,185,0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {/* Play Icon */}
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="black"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            </div>
            
            <h1
              style={{
                fontSize: '96px',
                fontWeight: 900,
                color: 'white',
                letterSpacing: '-0.04em',
                margin: 0,
                lineHeight: 1,
                textShadow: '0 0 40px rgba(255,255,255,0.2)',
              }}
            >
              Clippay
            </h1>
          </div>

          {/* Tagline */}
          <div
             style={{
               color: '#a1a1aa', // zinc-400
               fontSize: '28px',
               fontWeight: 500,
               marginTop: '10px',
               letterSpacing: '-0.01em',
             }}
          >
            Marketing that pays. Literally.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
