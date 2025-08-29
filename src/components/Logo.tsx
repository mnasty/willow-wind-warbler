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
    <path d="M4 22v-8l8-6 8 6v8" />
    <path d="M12 10v12" />
    <path d="M18 22V10l-6-4.5L6 10v12" />
    <path d="M2 22h20" />
    <path d="M17 2h-2a2 2 0 0 0-2 2v2" />
  </svg>
);

export default Logo;
