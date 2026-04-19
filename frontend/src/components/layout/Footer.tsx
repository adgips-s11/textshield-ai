import Link from 'next/link';
import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-dark-border bg-dark-surface">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-primary-500" />
              <span className="text-lg font-bold text-white">TextShield AI</span>
            </div>
            <p className="text-gray-400 text-sm">
              Protecting you from spam and misinformation using artificial intelligence.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#features" className="text-gray-400 hover:text-primary-500 transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#detector" className="text-gray-400 hover:text-primary-500 transition">
                  Try It
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-400 hover:text-primary-500 transition">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-400 hover:text-primary-500 transition">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                   className="text-gray-400 hover:text-primary-500 transition">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-dark-border text-center">
          <p className="text-gray-400 text-sm">
            © 2026 TextShield AI. Made with ❤️ for a safer digital world.
          </p>
        </div>
      </div>
    </footer>
  );
}