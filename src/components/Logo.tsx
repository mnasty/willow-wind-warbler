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
    {/* Barn */}
    <path d="M4 21h10V9l-5-4-5 4v12z" fill="hsl(var(--primary))" stroke="hsl(var(--foreground))"/>
    <path d="M4 21h10" stroke="hsl(var(--foreground))" strokeLinecap="butt"/>
    <path d="M7 15h4v6h-4v-6z" fill="hsl(var(--background))" stroke="hsl(var(--foreground))"/>
    <path d="M7 18h4"/>
    <path d="M9 15v-1"/>

    {/* Silo */}
    <path d="M15 21V9c0-2.21 1.34-4 3-4h0c1.66 0 3 1.79 3 4v12" fill="hsl(var(--muted))" stroke="hsl(var(--muted-foreground))"/>
    <path d="M15 9c0-2.21 1.34-4 3-4h0c1.66 0 3 1.79 3 4" stroke="hsl(var(--muted-foreground))"/>
  </svg>
);

export default Logo;
