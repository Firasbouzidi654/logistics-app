<script setup>
import Navbar from '../components/layout/Navbar.vue'
import Footer from '../components/layout/Footer.vue'
import HeroSection from '../components/home/HeroSection.vue'
import ProfileSection from '../components/home/ProfileSection.vue'
import ZielkonfliktSection from '../components/home/ZielkonfliktSection.vue'
import ModuleCards from '../components/home/ModuleCards.vue'
</script>

<template>
  <div class="min-h-screen bg-surface-900">
    <Navbar />
    <main>
      <HeroSection />
      <ProfileSection />
      <ZielkonfliktSection />
      <ModuleCards />
    </main>
    <Footer />
  </div>
</template>
