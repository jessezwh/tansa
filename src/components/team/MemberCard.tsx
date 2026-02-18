'use client'

import Image from 'next/image'
import { useState } from 'react'

interface MemberCardProps {
  member: ExecMember
  priority?: boolean
}

export default function MemberCard({ member, priority = false }: MemberCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="flex flex-col items-center w-[clamp(150px,20vw,250px)] min-h-[clamp(220px,28vw,350px)]">
      <div className="relative w-full aspect-square rounded-md overflow-hidden bg-skeleton">
        <Image
          src={
            member.profileImage?.url ||
            '/placeholder.svg?height=250&width=250&query=team member portrait'
          }
          alt={member.name}
          fill
          sizes="(max-width: 640px) 150px, (max-width: 1024px) 20vw, 250px"
          priority={priority}
          quality={90}
          className={`rounded-md object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-skeleton to-skeleton-dark animate-pulse" />
        )}
      </div>
      <p className="mt-2 text-center text-[clamp(1rem,2vw,1.5rem)] text-tansa-blue font-draplink">
        {member.name}
      </p>
      <p className="text-center text-[clamp(0.8rem,1.5vw,1rem)] text-tansa-blue font-draplink">
        {member.position}
      </p>
      <p className="text-center text-[clamp(0.8rem,1.5vw,1rem)] text-tansa-blue font-draplink">
        {member.degree}
      </p>
    </div>
  )
}
