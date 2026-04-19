'use client';

import { useState } from 'react';
import { X, AlertCircle, CheckCircle2, ThumbsUp, ThumbsDown, Loader2, Sparkles } from 'lucide-react';
import type { DetectionResult } from '@/types/api';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

interface ResultsCardProps {
  result: DetectionResult;
  text: string;
  onClose: () => void;
}

type FeedbackState = 'idle' | 'submitting' | 'done';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

const OPPOSITE: Record<string, string> = {
  spam: 'ham',
  ham:  'spam',
  fake: 'real',
  real: 'fake',
};

export function ResultsCard({ result, text, onClose }: ResultsCardProps) {
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('idle');
  const [satisfiedWith, setSatisfiedWith] = useState<boolean | null>(null);
  const [retrainNote,   setRetrainNote  ] = useState('');

  const isSpam      = result.prediction === 'spam';
  const isFake      = result.prediction === 'fake';
  const isDangerous = isSpam || isFake;

  const verdict =
    isSpam                       ? 'SPAM DETECTED'      :
    result.prediction === 'ham'  ? 'LEGITIMATE MESSAGE' :
    isFake                       ? 'LIKELY FAKE NEWS'   :
                                   'LIKELY REAL NEWS';

  async function handleFeedback(satisfied: boolean) {
    setFeedbackState('submitting');
    setSatisfiedWith(satisfied);

    try {
      const res = await fetch(`${API_BASE}/api/feedback`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          processed_text: text.trim(),   // original textarea value — always non-empty
          prediction:     result.prediction,
          satisfied,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Feedback API error:', res.status, err);
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.retrain_triggered) {
        setRetrainNote('Model is retraining with your feedback in the background.');
      }
    } catch (err) {
      console.error('Feedback error:', err);
    } finally {
      setFeedbackState('done');
    }
  }

  return (
    <Card variant="gradient" className="relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition"
        aria-label="Close"
      >
        <X className="h-5 w-5 text-gray-400" />
      </button>

      <div className="space-y-6">

        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Analysis Results</h3>
          <Badge variant={isDangerous ? 'danger' : 'success'}>
            {isDangerous
              ? <AlertCircle  className="h-4 w-4" />
              : <CheckCircle2 className="h-4 w-4" />}
            {verdict}
          </Badge>
        </div>

        <ProgressBar value={result.confidence} />

        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-3">Detailed Probabilities</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(result.probabilities).map(([key, value]) => (
              <div key={key} className="p-3 bg-dark-surface rounded-lg">
                <div className="text-xs text-gray-400 uppercase mb-1">{key}</div>
                <div className="text-2xl font-bold text-primary-400">
                  {(value as number).toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {result.contentAnalysis && (
          <div className="pt-4 border-t border-dark-border">
            <h4 className="text-sm font-semibold text-gray-400 mb-3">Content Analysis</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                Type Detected:{' '}
                <span className="text-primary-400 font-semibold">
                  {result.contentAnalysis.classified_as.toUpperCase()}
                </span>
              </p>
              <p>Word Count: <span className="text-white">{result.contentAnalysis.word_count}</span></p>
              {result.contentAnalysis.news_keywords.length > 0 && (
                <p>
                  News Keywords:{' '}
                  <span className="text-primary-400">
                    {result.contentAnalysis.news_keywords.join(', ')}
                  </span>
                </p>
              )}
              {result.contentAnalysis.sms_keywords.length > 0 && (
                <p>
                  SMS Keywords:{' '}
                  <span className="text-primary-400">
                    {result.contentAnalysis.sms_keywords.join(', ')}
                  </span>
                </p>
              )}
            </div>
          </div>
        )}

        <div className="pt-5 border-t border-dark-border">
          {feedbackState === 'idle' && (
            <FeedbackPrompt onFeedback={handleFeedback} />
          )}
          {feedbackState === 'submitting' && (
            <div className="flex items-center justify-center gap-3 py-4 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin text-primary-400" />
              <span className="text-sm">Saving your feedback…</span>
            </div>
          )}
          {feedbackState === 'done' && (
            <FeedbackConfirmation
              satisfied={satisfiedWith!}
              prediction={result.prediction}
              retrainNote={retrainNote}
            />
          )}
        </div>

      </div>
    </Card>
  );
}

function FeedbackPrompt({ onFeedback }: { onFeedback: (s: boolean) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gray-300 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary-400" />
        Was this result accurate?
      </p>
      <p className="text-xs text-gray-500 leading-relaxed">
        Your answer is stored and used to retrain the model — helping it get smarter over time.
      </p>
      <div className="flex gap-3 pt-1">
        <button
          onClick={() => onFeedback(true)}
          className="
            flex-1 flex items-center justify-center gap-2
            px-4 py-2.5 rounded-lg text-sm font-semibold
            bg-emerald-500/10 border border-emerald-500/30 text-emerald-400
            hover:bg-emerald-500/20 hover:border-emerald-500
            transition-all duration-200 active:scale-95
          "
        >
          <ThumbsUp className="h-4 w-4" />
          Yes, correct
        </button>
        <button
          onClick={() => onFeedback(false)}
          className="
            flex-1 flex items-center justify-center gap-2
            px-4 py-2.5 rounded-lg text-sm font-semibold
            bg-red-500/10 border border-red-500/30 text-red-400
            hover:bg-red-500/20 hover:border-red-500
            transition-all duration-200 active:scale-95
          "
        >
          <ThumbsDown className="h-4 w-4" />
          No, wrong
        </button>
      </div>
    </div>
  );
}

function FeedbackConfirmation({
  satisfied,
  prediction,
  retrainNote,
}: {
  satisfied: boolean;
  prediction: string;
  retrainNote: string;
}) {
  return (
    <div className={`
      rounded-lg px-4 py-3 border text-sm space-y-1
      ${satisfied
        ? 'bg-emerald-500/10 border-emerald-500/20'
        : 'bg-blue-500/10   border-blue-500/20'}
    `}>
      <p className={`font-semibold flex items-center gap-2 ${satisfied ? 'text-emerald-400' : 'text-blue-400'}`}>
        <CheckCircle2 className="h-4 w-4" />
        {satisfied
          ? 'Prediction confirmed — stored as training data.'
          : `Noted! Stored as "${OPPOSITE[prediction] ?? prediction}" to improve accuracy.`}
      </p>
      <p className="text-gray-400 text-xs">
        Thank you — every piece of feedback makes the model smarter.
        {retrainNote && <span className="block mt-1 text-primary-400">{retrainNote}</span>}
      </p>
    </div>
  );
}