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
    <path d="M17 21V10c0-2.21-1.79-4-4-4h0c-2.21 0-4 1.79-4 4v11" fill="hsl(var(--muted))" stroke="hsl(var(--muted-foreground))"/>
    <path d="M9 10c0-2.21 1.79-4 4-4h0c2.21 0 4 1.79 4 4" stroke="hsl(var(--muted-foreground))"/>
    <path d="M13 6V5c0-1.1.9-2 2-2h0c1.1 0 2 .9 2 2v1" stroke="hsl(var(--muted-foreground))"/>
    
    {/* Barn */}
    <path d="M4 21h18v-8L12 5 2 13v8z" fill="hsl(var(--primary))" stroke="hsl(var(--foreground))"/>
    <path d="M4 21h18" stroke="hsl(var(--foreground))" strokeLinecap="butt"/>
    <path d="M10 15h4v6h-4v-6z" fill="hsl(var(--background))" stroke="hsl(var(--foreground))"/>
    <path d="M10 18h4"/>
    <path d="M12 15v-1"/>
  </svg>
);

export default Logo;
