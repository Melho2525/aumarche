'use client';

import { motion } from 'framer-motion';
import { Truck, Shield, Clock, Users, Gift, Star } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Livraison Express',
    description: 'Livraison gratuite en moins de 24h dans toute la région d\'Abidjan',
    color: 'text-primary',
  },
  {
    icon: Shield,
    title: 'Paiement Sécurisé',
    description: 'Transactions 100% sécurisées avec Orange Money, MTN Money et Visa',
    color: 'text-secondary',
  },
  {
    icon: Clock,
    title: 'Service 24/7',
    description: 'Notre équipe est disponible pour vous accompagner à tout moment',
    color: 'text-primary',
  },
  {
    icon: Users,
    title: 'Programme de Parrainage',
    description: 'Gagnez des récompenses en parrainant vos proches',
    color: 'text-secondary',
  },
  {
    icon: Gift,
    title: 'Récompenses Exclusives',
    description: 'Débloquez des avantages uniques selon votre niveau de parrainage',
    color: 'text-primary',
  },
  {
    icon: Star,
    title: 'Qualité Garantie',
    description: 'Produits frais sélectionnés avec soin auprès de nos producteurs locaux',
    color: 'text-secondary',
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Pourquoi choisir <span className="text-gradient">Aumarché</span> ?
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Découvrez tous les avantages de notre plateforme innovante conçue pour 
            simplifier vos achats alimentaires quotidiens.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="card-shadow p-8 text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`inline-block p-4 rounded-full bg-gradient-to-br from-primary-50 to-secondary-50 mb-6`}
              >
                <feature.icon size={32} className={feature.color} />
              </motion.div>
              
              <h3 className="text-xl font-semibold mb-4 text-neutral-800">
                {feature.title}
              </h3>
              
              <p className="text-neutral-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}