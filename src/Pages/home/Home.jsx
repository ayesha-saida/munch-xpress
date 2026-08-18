import React from 'react'
import Hero from '../../shared components/Hero'
import TrendingCuisines from './TrendingCuisines'
import ChefSpecial from './ChefSpecial'
import CuisineCarousel from './CuisineCarousel'
//import OnboardingCarousel from '../../shared components/OnboardingCarousel/OnboardingCarousel'

export default function Home () {
  return (
  <>
      <Hero />  
    <CuisineCarousel /> 
    <TrendingCuisines /> 
    <ChefSpecial /> 
 </>

  )
}




