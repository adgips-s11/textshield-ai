import { Mail, Newspaper, Zap, TrendingUp, Shield, Clock } from 'lucide-react';

const features = [
  {
    icon: Mail,
    title: 'Spam Detection',
    description: 'Identifies spam emails and SMS using Naive Bayes algorithm. Detects phishing attempts, fraudulent schemes, and malicious links.',
  },
  {
    icon: Newspaper,
    title: 'Fake News Detection',
    description: 'Analyzes news articles using Logistic Regression to determine authenticity. Helps combat misinformation and verify source credibility.',
  },
  {
    icon: Zap,
    title: 'Auto-Detection',
    description: 'Intelligently determines if content is a message or news article, then automatically routes to the appropriate detector.',
  },
  {
    icon: Clock,
    title: 'Real-Time Analysis',
    description: 'Instant classification results with confidence scores. Get immediate feedback on text authenticity and safety.',
  },
  {
    icon: TrendingUp,
    title: 'High Accuracy',
    description: '97% accuracy for spam detection and 95% for fake news. Trained on thousands of real-world examples.',
  },
  {
    icon: Shield,
    title: 'Privacy Focused',
    description: 'Your text is processed securely and not stored. Complete privacy with no data retention policy.',
  },
];

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="p-6 bg-dark-card border border-dark-border rounded-xl hover:border-primary-500/50 transition-all hover:-translate-y-1 group"
        >
          <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mb-4">
            <feature.icon className="h-6 w-6 text-primary-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition">
            {feature.title}
          </h3>
          <p className="text-gray-400 leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}