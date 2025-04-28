'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ThemeToggle } from './core/theme_toggle';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import useAppStore from '@/lib/store';
import { Menu } from 'lucide-react';
import useAuthStore from '@/lib/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Navbar() {
  const { setSheet } = useAppStore();
  const { token, logout, hydrate } = useAuthStore();
  const router = useRouter();

  useEffect(()=>{
    hydrate()
  },[token])
  const isLoggedIn = Boolean(token);

  const handleLogout = () => {
    logout();
    router.push('/studio');
  };

  const handleMovile = () => {
    setSheet({
      content: <nav className="flex flex-col gap-4 mt-6">
        {links.map(({ href, label }) => (
          <Link key={href} href={href} className="font-medium">
            {label}
          </Link>
        ))}

        {isLoggedIn ? (
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <>
            <Link href="/login" className="font-medium">
              Login
            </Link>
            <Link href="/signup" className="font-medium">
              Signup
            </Link>
          </>
        )}
      </nav>,
      description: "",
      isOpen: true,
      title: "Menu",
      side: "right"
    })
  }

  const links = [
    { href: '/home', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="border-b">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold">
          MyWebsite
        </Link>
        <ThemeToggle />

        {/* --- Escritorio -------------------------------------------------- */}
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList className="flex gap-2">
            {links.map(({ href, label }) => (
              <NavigationMenuItem key={href}>
                <NavigationMenuLink
                  href={href}
                  className={navigationMenuTriggerStyle()}
                >
                  {label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

            {isLoggedIn ? (
              <NavigationMenuItem>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </NavigationMenuItem>
            ) : (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/login"
                    className={navigationMenuTriggerStyle()}
                  >
                    Login
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/signup"
                    className={navigationMenuTriggerStyle()}
                  >
                    Signup
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* --- Móvil ------------------------------------------------------- */}
        <Button variant="outline" size="icon" onClick={handleMovile} className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </nav>
    </header>
  );
}
