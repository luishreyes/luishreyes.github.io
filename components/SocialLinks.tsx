
import React from 'react';

const socialLinks = [
  {
    name: 'LinkedIn',
    url: 'http://linkedin.com/in/luishreyes',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
      </svg>
    ),
  },
  {
    name: 'Google Scholar',
    url: 'https://scholar.google.com/citations?user=2vO8IrIAAAAJ&hl=es',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 8.48L6.21 8.24 12 5.09l5.79 3.15L12 11.48zM5 13.18V17.5l7 3.5 7-3.5v-4.32l-7 3.5-7-3.5z" />
      </svg>
    ),
  },
  {
    name: 'ResearchGate',
    url: 'https://www.researchgate.net/profile/Luis-Reyes-26',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M15.42 13.94c0-1.286.58-2.057 1.543-2.057.857 0 1.457.771 1.457 2.057 0 1.286-.6 2.057-1.457 2.057-.963 0-1.543-.771-1.543-2.057zm-4.286 0c0-1.286.58-2.057 1.543-2.057.857 0 1.457.771 1.457 2.057 0 1.286-.6 2.057-1.457 2.057-.963 0-1.543-.771-1.543-2.057zM5.143 4v12.571c0 .686.58 1.286 1.286 1.286h9.143c.706 0 1.286-.6 1.286-1.286V9.886c-.343.086-.6.086-.943.086-.857 0-1.714-.343-2.4-.943-.514-.514-.857-1.029-1.029-1.714H6.429V4H5.143zm.171 13.543c-.706 0-1.286-.58-1.286-1.286V5.429c0-.706.58-1.286 1.286-1.286h12.114c.706 0 1.457.58 1.457 1.286v12.257c0 .706-.751 1.286-1.457 1.286H5.314zM12 0C5.371 0 0 5.371 0 12s5.371 12 12 12 12-5.371 12-12S18.629 0 12 0z"/>
      </svg>
    ),
  },
];

interface SocialLinksProps {
  className?: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ className = '' }) => {
  return (
    <div className={`flex justify-center items-center space-x-6 ${className}`}>
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View Luis H. Reyes's ${link.name} profile`}
          className="text-zinc-400 hover:text-brand-dark transition-colors duration-200"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};
