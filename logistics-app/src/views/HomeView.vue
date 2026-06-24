<script setup>
import Navbar from '../components/layout/Navbar.vue'
import Footer from '../components/layout/Footer.vue'
import HeroSection from '../components/home/HeroSection.vue'
import ProfileSection from '../components/home/ProfileSection.vue'
import LearningJourneySection from '../components/home/LearningJourneySection.vue'
</script>

<template>
  <div class="min-h-screen bg-surface-900">
    <Navbar />
    <main>
      <HeroSection />
      <ProfileSection />
      <LearningJourneySection />
    </main>
    <Footer />
  </div>
</template>
