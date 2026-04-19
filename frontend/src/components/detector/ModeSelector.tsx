'use client';

import { Mail, Newspaper, Zap } from 'lucide-react';
import type { DetectionMode } from '@/types/api';
import clsx from 'clsx';

interface ModeSelectorProps {
  mode: DetectionMode;
  onModeChange: (mode: DetectionMode) => void;
}

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  const modes = [
    { id: 'auto' as DetectionMode, label: 'Auto-Detect', icon: Zap },
    { id: 'spam' as DetectionMode, label: 'Spam Detection', icon: Mail },
    { id: 'news' as DetectionMode, label: 'Fake News Detection', icon: Newspaper },
  ];

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {modes.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onModeChange(id)}
          className={clsx(
            'flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all',
            'border-2',
            mode === id
              ? 'bg-primary-500/10 border-primary-500 text-primary-400'
              : 'bg-dark-card border-dark-border text-gray-400 hover:border-primary-500/50 hover:text-primary-400'
          )}
        >
          <Icon className="h-5 w-5" />
          {label}
        </button>
      ))}
    </div>
  );
}