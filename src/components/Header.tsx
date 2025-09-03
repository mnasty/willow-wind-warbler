"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, UserCog } from 'lucide-react';
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
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { ThemeToggle } from './theme-toggle';

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
            <Logo className="h-14 w-14 text-foreground transition-transform group-hover:rotate-12 group-hover:text-primary" />
            <span className="text-3xl font-fredoka font-bold text-foreground group-hover:text-primary self-end pb-1">
              <span className="hidden md:inline">Willow Wind Warbler</span>
              <span className="inline md:hidden">WWW</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            {visibleNavLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                asChild
                className={cn(
                  'font-semibold text-foreground',
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
            <ThemeToggle />
          </nav>
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
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
                 <DropdownMenuSeparator />
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
