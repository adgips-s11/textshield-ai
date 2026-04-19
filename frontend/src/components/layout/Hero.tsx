'use client';

import { Button } from '@/components/ui/Button';
import { Zap, ArrowRight, Shield, TrendingUp } from 'lucide-react';

export function Hero() {
  const scrollToDetector = () => {
    const element = document.getElementById('detector');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-primary-500/10 border border-primary-500/20 rounded-full animate-fade-in">
            <Shield className="h-4 w-4 text-primary-400" />
            <span className="text-primary-400 text-sm font-semibold">
              AI-Powered Detection • 97% Accuracy
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up">
            Detect Spam & Fake News with{' '}
            <span className="text-gradient">
              Artificial Intelligence
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-up delay-100">
            Advanced machine learning system that automatically classifies spam messages
            and identifies fake news articles with high accuracy. Protect yourself from
            misinformation and malicious content.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up delay-200">
            <Button
              size="lg"
              onClick={scrollToDetector}
              className="group"
            >
              <Zap className="w-5 h-5 group-hover:animate-pulse" />
              Try Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={scrollToFeatures}
            >
              Learn More
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto animate-slide-up delay-300">
            <div className="group">
              <div className="relative">
                <div className="text-5xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform">
                  97%
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity" />
              </div>
              <div className="text-gray-400 text-sm font-medium">
                Spam Detection Accuracy
              </div>
              <div className="flex items-center justify-center gap-1 mt-1 text-green-400 text-xs">
                <TrendingUp className="h-3 w-3" />
                <span>Industry Leading</span>
              </div>
            </div>

            <div className="group">
              <div className="relative">
                <div className="text-5xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform">
                  95%
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity" />
              </div>
              <div className="text-gray-400 text-sm font-medium">
                Fake News Detection
              </div>
              <div className="flex items-center justify-center gap-1 mt-1 text-green-400 text-xs">
                <TrendingUp className="h-3 w-3" />
                <span>Highly Accurate</span>
              </div>
            </div>

            <div className="group">
              <div className="relative">
                <div className="text-5xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform">
                  3
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity" />
              </div>
              <div className="text-gray-400 text-sm font-medium">
                Detection Modes
              </div>
              <div className="flex items-center justify-center gap-1 mt-1 text-blue-400 text-xs">
                <Zap className="h-3 w-3" />
                <span>Auto-Detect Available</span>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Privacy Focused</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Real-Time Results</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Continuously Improving</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary-500 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}