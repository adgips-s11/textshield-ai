'use client';

const samples = [
  { label: 'Spam Example', text: 'CONGRATULATIONS! You\'ve won $1,000,000! Click here NOW to claim your prize!!!' },
  { label: 'Legitimate Message', text: 'Hey, can we reschedule our meeting to 3pm tomorrow? Let me know if that works for you.' },
  { label: 'Real News', text: 'Scientists at MIT announce breakthrough in renewable energy technology that could revolutionize solar power generation.' },
  { label: 'Fake News', text: 'SHOCKING: Government admits aliens control the weather and have been hiding this secret for decades!!!' },
];

interface SampleTextsProps {
  onSampleClick: (text: string) => void;
}

export function SampleTexts({ onSampleClick }: SampleTextsProps) {
  return (
    <div className="mt-6 p-4 bg-dark-card rounded-lg border border-dark-border">
      <p className="text-sm text-gray-400 mb-3">Try sample texts:</p>
      <div className="flex flex-wrap gap-2">
        {samples.map((sample) => (
          <button
            key={sample.label}
            onClick={() => onSampleClick(sample.text)}
            className="px-3 py-1.5 text-sm bg-dark-surface hover:bg-dark-border text-gray-300 
                     hover:text-white rounded-lg transition border border-dark-border 
                     hover:border-primary-500/50"
          >
            {sample.label}
          </button>
        ))}
      </div>
    </div>
  );
}