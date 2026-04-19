'use client';

import { Menu, Shield, X } from "lucide-react";
import Link from "next/link";
import { MouseEvent, useEffect, useState } from "react";
import { Button } from "../ui/Button";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '#home', label: 'Home' },
        { href: '#features', label: 'Features' },
        { href: '#detector', label: 'Try It' },
        { href: '#about', label: 'About' },
    ];

    const scrollToSection = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    return(
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-dark-surface/90 backdrop-blur-md border-b border-dark-border shadow-lg': 'bg-transparent'}`}>
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2 group" onClick={(e) => scrollToSection(e, '#home')}>
                        <div className="relative">
                            <Shield className="h-8 w-8 text-primary-500 group-hover:text-primary-400 transition-colors" />
                            <div className="absolute inset-0 bg-primary-500/20 blur-xl group-hover:bg-primary-400/30 transition-all" />
                        </div>
                        <span className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                            TextShield AI
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a key={link.href} href={link.href} onClick={(e) => scrollToSection(e, link.href)} className="text-gray-300 hover:text-primary-400 font-medium transition-colors relative group">
                                {link.label}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
                            </a>
                        ))}
                    </div>

                    <div className="hidden md:block">
                        <Button
                            variant="primary"
                            onClick={() => {
                                const element = document.querySelector('#detector');
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                        >
                            Get Started
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-gray-300 hover:text-white transition-colors" aria-label="Toggle Mobile Menu">
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-dark-border animate-slide-down">
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <a key={link.href} href={link.href} onClick={(e) => scrollToSection(e, link.href)} className="text-gray-300 hover:text-primary-400 font-medium transition-colors py-2">
                                    {link.label}
                                </a>
                            ))}
                            <Button
                                variant="primary"
                                className="w-full mt-2"
                                onClick={() => {
                                    const element = document.querySelector('#detector');
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                        setIsMobileMenuOpen(false);
                                    }
                                }}>
                                    Get Started
                                </Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}