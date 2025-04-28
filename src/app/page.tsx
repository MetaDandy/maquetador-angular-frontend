'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";  // Importación correcta del Button
import { Separator } from "@/components/ui/separator";  // Importación correcta del Separator
import Link from "next/link";  // Importación de Link de Next.js

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-800 dark:to-teal-900 py-20">
      <div className="container mx-auto px-4 text-center">
        {/* Card Component de ShadCN */}
        <Card className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold text-teal-600 dark:text-teal-300 mb-4">
              Maque-TAngular: Tu Maquetador Visual para Angular
            </CardTitle>
            <CardDescription className="text-xl text-gray-700 dark:text-gray-300 mb-6">
              Crea interfaces visualmente con GrapesJS y exporta automáticamente a Angular.
            </CardDescription>
          </CardHeader>

          <Separator className="my-6" />

          <CardContent>
            <img
              src="/Maque-TAngular-logo.png"
              alt="Maque-TAngular Logo"
              className="h-48 mb-8 mx-auto rounded-full shadow-lg"
            />
            <div className="flex justify-center gap-6">
              {/* Botón de acción */}
              <Link href="/comenzar">
                <Button variant="default" className="bg-teal-600 text-white hover:bg-teal-700 transition duration-300">
                  Comienza ahora
                </Button>
              </Link>
              {/* Botón de login */}
              <Link href="/login">
                <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white transition duration-300">
                  Iniciar sesión
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
