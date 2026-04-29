'use client';

import { ModeSelector } from "@/components/detector/ModeSelector";
import { ResultsCard } from "@/components/detector/ResultsCard";
import { SampleTexts } from "@/components/detector/SampleTexts";
import { TextInput } from "@/components/detector/TextInput";
import { FeatureGrid } from "@/components/features/FeatureGrid";
import { Hero } from "@/components/layout/Hero";
import { useDetection } from "@/hooks/useDetection";
import { DetectionMode } from "@/types/api";
import { useState } from "react";

export default function Home() {
  const [mode, setMode] = useState<DetectionMode>('auto');
  const [text, setText] = useState('');
  const { isLoading, error, result, analyze, reset } = useDetection();

  const handleAnalyze = async () => {
    await analyze(text, mode);
  };

  const handleClear = () => {
    setText('');
    reset();
  };

  const handleSampleClick = (sampleText: string) => {
    setText(sampleText);
    reset();
  };

  return (
    <main className="min-h-screen bg-dark-bg">
      <Hero />

      <section id="features" className="py-20 bg-dark-surface">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Advanced AI capabilities designed to protect you from digital threats
            </p>
          </div>
          <FeatureGrid />
        </div>
      </section>

      <section id="detector" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Try the Detector
            </h2>
            <p className="text-gray-400 text-lg">
              Enter any text message or news article to analyze
            </p>
          </div>

          <ModeSelector mode={mode} onModeChange={setMode} />

          <div className="max-w-4xl mx-auto pt-8">
            <TextInput
              value={text}
              onChange={setText}
              onAnalyze={handleAnalyze}
              onClear={handleClear}
              isLoading={isLoading}
              disabled={isLoading}
            />

            <SampleTexts onSampleClick={handleSampleClick} />

            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-center">{error}</p>
              </div>
            )}

            {result && !isLoading && (
              <div className="mt-8 animate-slide-up">
                {/* Pass text so ResultsCard can send it as the feedback payload */}
                <ResultsCard result={result} text={text} onClose={reset} />
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-dark-surface">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-8">
              About This Project
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              This intelligent text classification system uses advanced machine learning
              algorithms to detect spam messages and identify fake news articles. Built
              with modern technologies including FastAPI, Next.js, React, and TypeScript,
              it demonstrates practical applications of Natural Language Processing (NLP)
              and AI.
            </p>
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Technology Stack
              </h3>
              <div className="flex flex-wrap gap-3">
                {['FastAPI', 'Next.js', 'React', 'TypeScript', 'TailwindCSS',
                  'Scikit-learn', 'Pandas', 'Naive Bayes', 'Logistic Regression'].map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-primary-500/10 border border-primary-500/20
                             rounded-lg text-primary-400 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}