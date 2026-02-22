import { Suspense } from 'react'
import { getExecMembers } from '@/libs/server'
import Image from 'next/image'
import TeamSection from '@/components/team/TeamSection'
import TeamSkeleton from '@/components/team/TeamSkeleton'
import { ErrorBoundary } from '@/components/events/ErrorBoundary'

function processTeamCategories(exec: Awaited<ReturnType<typeof getExecMembers>>) {
  const categoryMap = new Map<string, typeof exec>()

  // Group members by category efficiently
  exec.forEach((member) => {
    const existing = categoryMap.get(member.category) || []
    categoryMap.set(member.category, [...existing, member])
  })

  // Define category order
  const categoryOrder = [
    'Presidents',
    'Admin / Advisory',
    'Activities',
    'Public Relations Officer',
    'Marketing',
    'Design / Photography',
    'AESIR',
    'Interns',
  ]

  return categoryOrder
    .map((title) => ({
      title,
      members: categoryMap.get(title) || [],
    }))
    .filter(({ members }) => members.length > 0)
}

async function TeamContent() {
  const exec = await getExecMembers()
  const categories = processTeamCategories(exec)

  return (
    <div className="bg-brand-bg pb-10">
      {/* Hero Section */}
      <div className="bg-brand-orange">
        <div className="max-w-6xl h-48 lg:h-72 mx-auto flex items-center justify-between relative overflow-y-clip overflow-x-visible">
          <div className="relative z-20 pl-4 lg:pl-0 lg:mt-4">
            <div className="font-draplink font-bold text-white leading-none text-6xl lg:text-9xl">
              <h1 className='text-4xl lg:text-7xl'>Meet Our</h1>
              <h1>TEAM!</h1>
            </div>
          </div>

          {/* Bear image */}
          <div className="absolute right-5 -bottom-25 lg:-bottom-50 select-none z-10 w-45 lg:w-75">
            <Image
              src="/bears/waving_bear.svg"
              alt="Bear waving hello"
              width={400}
              height={400}
              className="object-contain w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>

      {/* TEAM SECTIONS - responsive improvements preserved */}
      {categories.map(({ title, members }, index) => (
        <TeamSection key={title} title={title.toUpperCase()} members={members} isFirst={index === 0} />
      ))}
    </div>
  )
}

export default function AboutPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<TeamSkeleton />}>
        <TeamContent />
      </Suspense>
    </ErrorBoundary>
  )
}
