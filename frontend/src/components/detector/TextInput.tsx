'use client';

import { Button } from '@/components/ui/Button';
import { Search, X } from 'lucide-react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export function TextInput({
  value,
  onChange,
  onAnalyze,
  onClear,
  isLoading,
  disabled,
}: TextInputProps) {
  return (
    <div className="space-y-4">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your text here... (e.g., an email, SMS, or news headline)"
        rows={6}
        disabled={disabled}
        className="w-full px-4 py-3 bg-dark-card border-2 border-dark-border rounded-lg 
                 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 
                 transition-colors resize-y disabled:opacity-50"
      />

      <div className="flex gap-3">
        <Button
          onClick={onAnalyze}
          disabled={disabled || !value.trim()}
          isLoading={isLoading}
          className="flex-1"
        >
          <Search className="h-5 w-5" />
          Analyze Text
        </Button>

        <Button
          variant="secondary"
          onClick={onClear}
          disabled={disabled}
        >
          <X className="h-5 w-5" />
          Clear
        </Button>
      </div>
    </div>
  );
}