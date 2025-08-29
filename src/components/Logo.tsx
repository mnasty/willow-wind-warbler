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
    <path d="M14 21V9h7v12" fill="hsl(var(--accent))" />
    <path d="M14 9 a3.5 3.5 0 0 1 7 0" fill="hsl(var(--accent))" stroke="currentColor" />
    <path d="M14 21V9" stroke="currentColor" />
    <path d="M21 21V9" stroke="currentColor" />
    <path d="M14 9h7" stroke="currentColor" />
    <path d="M14 13h7" stroke="currentColor" />
    <path d="M14 17h7" stroke="currentColor" />


    {/* Barn */}
    <path d="M3 21h10V9l-5-4-5 4v12z" fill="hsl(var(--secondary))" stroke="currentColor"/>
    <path d="M13 21H3" strokeLinecap="butt"/>
    {/* Barn Door */}
    <path d="M6 21V15h4v6" stroke="currentColor" />
    <path d="M6 15l4 6" />
    <path d="M10 15l-4 6" />

    {/* Window */}
    <path d="M8 12.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" fill="currentColor" stroke="currentColor" />
  </svg>
);

export default Logo;
