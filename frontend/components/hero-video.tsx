"use client";

import { Player } from "@remotion/player";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Check, CreditCard, DollarSign } from "lucide-react";

// The actual video content (Composition)
const PaymentSuccessComposition = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Animations using springs and interpolation
  const cardScale = spring({
    frame,
    fps,
    delay: 10,
    config: { damping: 12 },
  });

  const checkScale = spring({
    frame: frame - 40,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  const textOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateRight: "clamp",
  });
  
  const textTranslateY = interpolate(frame, [50, 70], [20, 0], {
     extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="bg-zinc-950 flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/30 to-zinc-950" />
      
      {/* Phone/Card Container */}
      <div 
        style={{ transform: `scale(${cardScale})` }}
        className="relative w-[300px] h-[500px] bg-zinc-900 rounded-[40px] border-[8px] border-zinc-800 shadow-2xl flex flex-col items-center overflow-hidden"
      >
        {/* Screen Content */}
        <div className="w-full h-full bg-zinc-950 pt-20 flex flex-col items-center relative">
           
           {/* Success Circle */}
           <div className="relative">
             <div 
               style={{ transform: `scale(${checkScale})` }}
               className="w-24 h-24 rounded-full bg-[#1DE1B9]/20 flex items-center justify-center mb-6"
             >
                <div className="w-16 h-16 rounded-full bg-[#1DE1B9] flex items-center justify-center shadow-[0_0_20px_rgba(29,225,185,0.5)]">
                    <Check className="text-zinc-950 w-10 h-10 stroke-[3px]" />
                </div>
             </div>
           </div>

           {/* Amount */}
           <div style={{ opacity: textOpacity, transform: `translateY(${textTranslateY}px)` }} className="text-center">
              <p className="text-zinc-400 text-sm font-medium mb-1">Payment Sent</p>
              <h1 className="text-4xl font-bold text-white tracking-tight flex items-center justify-center">
                <span className="text-zinc-500 text-2xl mr-1">$</span>
                125.00
              </h1>
           </div>

           {/* Recipient */}
           <div 
             style={{ opacity: textOpacity, transform: `translateY(${textTranslateY}px)`, transitionDelay: "100ms" }} 
             className="mt-12 w-full px-6"
           >
              <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E11D48] to-[#1DE1B9]" />
                 <div>
                    <p className="text-white font-medium text-sm">Sarah Designer</p>
                    <p className="text-xs text-zinc-500">@sarah_design</p>
                 </div>
              </div>
           </div>
           
           {/* Bottom Details */}
           <div 
              style={{ opacity: textOpacity, transform: `translateY(${textTranslateY}px)` }}
              className="mt-auto mb-8 text-zinc-600 text-xs flex gap-2"
           >
              <CreditCard className="w-3 h-3" />
              <span>Paid with Visa •••• 4242</span>
           </div>

        </div>
      </div>
    </AbsoluteFill>
  );
};

export const HeroVideo = ({ className }: { className?: string }) => {
  return (
    <div className={`w-full h-full relative group overflow-hidden ${className}`}>
      <Player
        component={PaymentSuccessComposition}
        durationInFrames={150}
        compositionWidth={400}
        compositionHeight={600}
        fps={30}
        loop
        autoPlay
        controls={false}
        className="w-full h-full object-cover"
        style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        }}
      />
      {/* Overlay to blend it a bit */}
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-3xl" />
    </div>
  );
};
