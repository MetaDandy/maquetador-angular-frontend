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
import ExportXmlToAngularModal from '@/app/studio/components/xml_to_angular_modal';

export default function Navbar() {
  const { setSheet } = useAppStore();
  const { token, logout, hydrate } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    hydrate()
  }, [token])
  const isLoggedIn = Boolean(token);

  const handleLogout = () => {
    logout();
    router.push('/studio');
  };

  const handleExportXml = () => {
    setSheet({
      isOpen: true,
      title: `Exportar Proyecto`,
      description: 'Ingrese el titulo del proyecto a exportar',
      btnAction: null,
      btnCancel: null,
      content: <ExportXmlToAngularModal />,
      side: "bottom"
    });
  }

  const handleMovile = () => {
    setSheet({
      content: <nav className="flex flex-col gap-4 mt-6">

        <Link href="/studio" className="font-medium">
          Studio
        </Link>
        <Button variant="ghost" onClick={() => handleExportXml()}>
          Exportar desde xml
        </Button>
        {isLoggedIn ? (
          <>
            <Link href="/studio/projects" className="font-medium">
              Ver proyectos
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </>
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

  return (
    <header className="border-b">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold">
          <img
            src="/Maque-TAngular-logo.png"
            alt="Maque-TAngular Logo"
            className="h-10 md:h-12" 
          />
        </Link>

        {/* --- Escritorio -------------------------------------------------- */}
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList className="flex gap-2">
            <NavigationMenuItem>
              <Button onClick={() => handleExportXml()} variant="ghost">
                Exportar desde xml
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/studio"
                className={navigationMenuTriggerStyle()}
              >
                Studio
              </NavigationMenuLink>
            </NavigationMenuItem>

            <ThemeToggle />
            {isLoggedIn ? (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/studio/projects"
                    className={navigationMenuTriggerStyle()}
                  >
                    Ver proyectos
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </NavigationMenuItem>
              </>
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
