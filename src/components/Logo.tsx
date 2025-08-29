import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20.34 10.43c.43-1.03.2-2.3-.58-3.1a3.5 3.5 0 0 0-4.95 0l-1.93 1.93" />
    <path d="M12.24 12.24 8.32 8.32a2.5 2.5 0 0 0-3.54 3.54l.58.58" />
    <path d="M11.76 11.76 14.6 14.6a2.5 2.5 0 0 1 0 3.54 2.5 2.5 0 0 1-3.54 0l-2.01-2.01" />
    <path d="m3 21 5-5" />
    <path d="M12.24 12.24c.73-.73 1.2-1.68 1.4-2.73" />
    <path d="M8.91 8.91c.1-.23.21-.45.33-.66" />
    <path d="M18.33 8.67c.33-.25.68-.48 1.05-.7" />
  </svg>
);

export default Logo;
