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
    <path d="M18 9.5V21h3V9.5" fill="hsl(var(--muted))" stroke="hsl(var(--muted-foreground))" />
    <path d="M18 9.5C18 7.5 19.5 6 21 6C22.5 6 24 7.5 24 9.5" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted))" />
    <path d="M18 12h3" />
    <path d="M18 15h3" />
    <path d="M18 18h3" />

    {/* Barn */}
    <path d="M3 21h13V10L9.5 4 3 10v11z" fill="hsl(var(--destructive))" stroke="hsl(var(--foreground))" />
    <path d="M3 10l13 0 -3 -6 -7 0 -3 6z" fill="hsl(var(--secondary-foreground))" stroke="hsl(var(--foreground))"/>

    {/* Barn Windows */}
    <path d="M7 7h1v1H7z" fill="hsl(var(--background))" strokeWidth="0.5"/>
    <path d="M11 7h1v1h-1z" fill="hsl(var(--background))" strokeWidth="0.5"/>

  </svg>
);

export default Logo;
