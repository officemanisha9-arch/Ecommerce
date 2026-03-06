import { createFileRoute } from '@tanstack/react-router'
import HeroSection from '../component/HeroSection'
import FeaturedCollections from '../component/feature'
import AboutSection from '../component/about'
import StatsSection from '../component/StatsSection'
import CategoriesSection from '@/component/CategoriesSection'
export const Route = createFileRoute('/')({
  
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50">
      <HeroSection />
      <FeaturedCollections />
      <AboutSection/>
      <StatsSection />
      <CategoriesSection />
    </div>
  )
}