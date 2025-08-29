import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Silo */}
    <path d="M14 21V8.5c0-2.5 1.5-4.5 3.5-4.5s3.5 2 3.5 4.5V21" fill="hsl(var(--accent))" stroke="hsl(var(--foreground))" />
    <path d="M21 9c-2.5 0-3.5-2-3.5-4.5" />
    <path d="M14 9c2.5 0 3.5-2 3.5-4.5" />
    <path d="M14 13h7" />
    <path d="M14 17h7" />

    {/* Barn */}
    <path d="M3 21h10V9l-5-4-5 4v12z" fill="hsl(var(--secondary))" stroke="hsl(var(--foreground))"/>
    <path d="M13 21H3" strokeLinecap="butt"/>
    {/* Barn Door */}
    <path d="M6 21V15h4v6" stroke="hsl(var(--foreground))" />
    <path d="M6 15l4 6" />
    <path d="M10 15l-4 6" />
    
    {/* Window */}
    <path d="M8 12.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" fill="hsl(var(--foreground))" stroke="hsl(var(--foreground))" />
  </svg>
);

export default Logo;
