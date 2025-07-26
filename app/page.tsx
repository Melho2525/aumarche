'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/home/hero';
import Features from '@/components/home/features';
import ParrainageCTA from '@/components/home/parrainage-cta';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Header />
      <main>
        <Hero />
        <Features />
        <ParrainageCTA />
      </main>
      <Footer />
    </motion.div>
  );
}