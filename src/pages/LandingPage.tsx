/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/shared/Button';
import { Clock, Target, Zap, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../services/firebase';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base overflow-x-hidden">
      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent-primary blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-secondary blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <nav className="relative z-10 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 bg-accent-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <span className="text-2xl font-bold text-text-primary tracking-tight">Nexora</span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-text-secondary font-medium">
          <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
          <a href="#about" className="hover:text-text-primary transition-colors">About</a>
          <Button variant="outline" className="ml-4" onClick={handleSignIn}>Sign In</Button>
        </div>
      </nav>

      <section className="relative z-10 pt-20 pb-32 px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-sm font-medium mb-6">
            Meet your academic war room
          </span>
          <h1 className="text-6xl md:text-8xl font-bold text-text-primary tracking-tight mb-8 leading-[1.1]">
            Engineer your future.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">
              Don't just survive it.
            </span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
            Nexora combines AI-powered CGPA intelligence and project strategy into one 
            war room built for engineering students.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-14 px-10 text-lg shadow-lg shadow-accent-primary/20" onClick={handleSignIn}>
              Get Started Free
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="ghost" size="lg" className="h-14 px-10 text-lg">
              Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-24 relative"
        >
          <div className="nx-card aspect-video max-w-5xl mx-auto overflow-hidden bg-bg-elevated/50 backdrop-blur-md p-2">
             <div className="bg-bg-base w-full h-full rounded-lg border border-border flex flex-col">
                <div className="h-12 border-b border-border flex items-center px-4 space-x-2">
                   <div className="flex space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-accent-danger/40" />
                      <div className="w-3 h-3 rounded-full bg-accent-warm/40" />
                      <div className="w-3 h-3 rounded-full bg-accent-secondary/40" />
                   </div>
                   <div className="h-6 w-1/3 bg-bg-elevated rounded-full animate-pulse ml-4" />
                </div>
                <div className="flex-1 p-6 grid grid-cols-3 gap-6">
                   <div className="col-span-2 space-y-6">
                      <div className="h-40 nx-card bg-bg-base/40 animate-pulse" />
                      <div className="h-60 nx-card bg-bg-base/40 animate-pulse" />
                   </div>
                   <div className="space-y-6">
                      <div className="h-full nx-card bg-bg-base/40 animate-pulse" />
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="relative z-10 py-32 px-8 bg-bg-surface/50 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Precision tools for engineers.</h2>
            <p className="text-text-secondary">Everything you need to master your academics and projects.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Clock className="h-8 w-8 text-accent-primary" />}
              title="CGPA Time Machine"
              description="Simulate every exam outcome before it happens. Know exactly what marks you need to secure your dream grade."
            />
            <FeatureCard 
              icon={<Target className="h-8 w-8 text-accent-secondary" />}
              title="Scope Radar"
              description="Know if your project idea can win — in 10 seconds. AI-powered evaluation of feasibility and industry relevance."
            />
            <FeatureCard 
              icon={<Zap className="h-8 w-8 text-accent-warm" />}
              title="Weekly War Room"
              description="AI that tells you exactly what to work on this week. Smart nudges based on your performance and deadlines."
            />
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-12 px-8 border-t border-border mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-text-secondary text-sm">
          <p>Built for engineers, by engineers. Nexora © 2025.</p>
          <p>Your data stays yours.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-8 nx-card hover:translate-y-[-8px] transition-all duration-300">
    <div className="h-16 w-16 rounded-2xl bg-bg-elevated flex items-center justify-center mb-6 border border-border">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="text-text-secondary leading-relaxed">{description}</p>
  </div>
);
