&apos;use client&apos;;

import Header from '@/components/layout/header&apos;;
import Footer from '@/components/layout/footer&apos;;
import Hero from '@/components/home/hero&apos;;
import Features from '@/components/home/features&apos;;
import ParrainageCTA from '@/components/home/parrainage-cta&apos;;
import { motion } from &apos;framer-motion&apos;;

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