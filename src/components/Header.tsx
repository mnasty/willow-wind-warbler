"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, UserCog, Palette } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '@/hooks/use-auth';
import { signOut } from '@/lib/firebase';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const navLinks = [
  { href: '/latest-edition', label: 'Latest Edition' },
  { href: '/historical-editions', label: 'Historical Editions' },
];

const adminLink = { href: '/administration', label: 'Administration' };


export default function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const visibleNavLinks = user ? [...navLinks, adminLink] : navLinks;

  return (
    <header className="bg-card shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo className="h-8 w-8 text-primary transition-transform group-hover:rotate-12" />
            <span className="text-3xl font-brand font-bold text-primary">
              Willow Wind Warbler
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            {visibleNavLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                asChild
                className={cn(
                  'font-semibold',
                  pathname === link.href && 'bg-accent/20 text-primary'
                )}
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
            {user ? (
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button asChild>
                <Link href="/login">
                  <UserCog className="mr-2 h-4 w-4" />
                  Admin Login
                </Link>
              </Button>
            )}
          </nav>
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {visibleNavLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
                 {user ? (
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/login">
                      <UserCog className="mr-2 h-4 w-4" />
                      Admin Login
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
