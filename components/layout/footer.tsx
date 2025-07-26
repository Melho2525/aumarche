'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-neutral-900 text-white"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et Description */}
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-bold text-gradient">
              Aumarché
            </h3>
            <p className="text-neutral-400">
              La plateforme de digitalisation des achats vivriers en Côte d'Ivoire. 
              Commandez vos produits frais directement depuis chez vous.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Twitter size={20} />
              </motion.a>
            </div>
          </div>

          {/* Liens Rapides */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Liens Rapides</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-neutral-400 hover:text-primary transition-colors">
                Accueil
              </Link>
              <Link href="/produits" className="block text-neutral-400 hover:text-primary transition-colors">
                Nos Produits
              </Link>
              <Link href="/parrainage" className="block text-neutral-400 hover:text-primary transition-colors">
                Programme de Parrainage
              </Link>
              <Link href="/about" className="block text-neutral-400 hover:text-primary transition-colors">
                À Propos
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Services</h4>
            <div className="space-y-2">
              <p className="text-neutral-400">Livraison à domicile</p>
              <p className="text-neutral-400">Produits frais garantis</p>
              <p className="text-neutral-400">Paiement sécurisé</p>
              <p className="text-neutral-400">Support client 24/7</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-primary" />
                <span className="text-neutral-400">+225 07 00 00 00 00</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-primary" />
                <span className="text-neutral-400">contact@aumarche.ci</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-primary" />
                <span className="text-neutral-400">Abidjan, Côte d'Ivoire</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-800 mt-8 pt-8 text-center">
          <p className="text-neutral-400">
            © 2024 Aumarché. Tous droits réservés. Développé avec ❤️ en Côte d'Ivoire.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}