import { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TextShield AI - Spam & Fake News Detector',
  description: 'AI-powered spam and fake news detection using machine learning',
  keywords: ['spam detection', 'fake news', 'machine learning', 'NLP', 'AI']
};

export default function RootLayout({
  children,
} : {
  children: ReactNode
}) {
  return(
    <html lang='en' className="scroll-smooth">
      <body className={`${inter.className} bg-dark-bg text-white antialiased`}>
        <Navbar />
        {children}
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#334155',
              color: '#fff',
              border: '1px solid #475569',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}