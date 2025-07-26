'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Gift, Users, Star, TrendingUp } from 'lucide-react';

const rewards = [
  { level: 1, filleuls: 3, bonus: '5%', icon: Gift },
  { level: 2, filleuls: 10, bonus: '10%', icon: Star },
  { level: 3, filleuls: 20, bonus: '15%', icon: TrendingUp },
];

export default function ParrainageCTA() {
  return (
    <section className="py-20 gradient-primary text-white relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-10 w-32 h-32 border-4 border-white rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 left-10 w-24 h-24 border-4 border-white rounded-full"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-heading font-bold mb-6"
          >
            Programme de Parrainage Exclusif
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl opacity-90 max-w-3xl mx-auto mb-8"
          >
            Invitez vos proches et gagnez des récompenses exceptionnelles. 
            Plus vous parrainez, plus vos avantages augmentent !
          </motion.p>
        </div>

        {/* Niveaux de récompenses */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {rewards.map((reward, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="inline-block p-4 bg-white/20 rounded-full mb-4"
              >
                <reward.icon size={32} />
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-2">Niveau {reward.level}</h3>
              <p className="text-lg mb-4">{reward.filleuls} filleuls</p>
              <div className="text-3xl font-bold text-yellow-300">
                {reward.bonus} de bonus
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <Link
            href="/signup"
            className="inline-flex items-center space-x-3 bg-white text-primary hover:bg-neutral-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Users size={24} />
            <span>Commencer à parrainer</span>
          </Link>
          
          <p className="mt-4 opacity-75">
            Inscription gratuite • Aucun engagement • Récompenses immédiates
          </p>
        </motion.div>
      </div>
    </section>
  );
}