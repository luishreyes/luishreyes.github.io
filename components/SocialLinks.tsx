
import React from 'react';

const socialLinks = [
  {
    name: 'LinkedIn',
    url: 'https://co.linkedin.com/in/luishreyes',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
      </svg>
    ),
  },
  {
    name: 'Google Scholar',
    url: 'https://scholar.google.com/citations?user=2vO8IrIAAAAJ&hl=en',
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
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 512 512">
        <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm85.1 357.3c-7.8 0-13.3-1.6-18.5-5.1-5.8-3.9-10.2-10.1-13.7-18.6l-21.2-52.4c-1.8-4.4-3.7-8-5.8-10.8-2.1-2.8-4.4-5-6.9-6.5-2.5-1.5-5.3-2.5-8.5-3.1-3.1-.6-6.7-.8-10.7-.8h-15.2v82.6c0 5.3-1.5 9.3-4.4 12.1-2.9 2.8-6.7 4.2-11.3 4.2-4.7 0-8.5-1.4-11.4-4.2-2.9-2.8-4.4-6.8-4.4-12.1V172.5c0-7.1 1.9-12.3 5.7-15.7 3.8-3.4 9.3-5.1 16.4-5.1h48.3c10.6 0 19.6 1.1 27.1 3.4 7.5 2.3 13.6 5.6 18.4 10 4.8 4.4 8.3 9.8 10.6 16.1 2.3 6.3 3.4 13.4 3.4 21.2 0 8.5-1.4 16-4.3 22.5-2.9 6.5-6.8 11.9-11.8 16.4-5 4.5-10.8 7.9-17.3 10.3 3.5 1.5 6.7 3.5 9.5 6 2.9 2.5 5.5 5.6 7.8 9.3 2.4 3.7 4.5 8 6.4 12.9l19.7 48.5c2.1 5.1 3.1 9.1 3.1 12 0 4.3-1.7 8-5 11.1-3.4 3-7.3 4.5-11.9 4.9zm-14.8-153.5c0-10.7-3.3-19-10-24.9-6.7-5.9-16.7-8.8-30-8.8h-25.7v69.4h23.3c8.3 0 15.3-1.2 21-3.5 5.7-2.3 10.3-5.5 13.7-9.4 3.4-4 5.9-8.5 7.4-13.8 1.6-5.2 1.3-5.7.3-9z"/>
      </svg>
    ),
  },
  {
    name: 'Photography Portfolio',
    url: 'https://luishreyes.myportfolio.com',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

interface SocialLinksProps {
  className?: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center space-x-6 ${className}`}>
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
