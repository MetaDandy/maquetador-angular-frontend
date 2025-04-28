'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use_auth";
import { API_ROUTES } from "@/lib/api.routes";
import useAppStore from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: 'Correo inválido.' }),
  password: z.string().min(6, { message: 'Mínimo de 6 caracteres.' })
});

export default function Home() {
  const { setToken } = useAuth();
  const { setLockScreen, showToast } = useAppStore();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLockScreen({ isVisible: true, type: "loading", content: "Iniciando sesión..." });

    try {
      const login = await fetch(API_ROUTES.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response = await login.json();

      if (!login.ok) throw new Error(response.message || "Error de autenticación");

      setToken(response.token);
      showToast('Inicio de sesión exitoso', "Bienvenido de vuelta", "success");
      reset();
      router.push('/studio');
    } catch (error: any) {
      showToast("Error", error.message, "error");
      console.error("Error en la solicitud:", error);
    } finally {
      setLockScreen(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-950 p-4 overflow-hidden">
      <Card className="w-full max-w-md shadow-xl border border-border dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800 dark:text-white">Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input {...register('email')} placeholder="Correo electrónico" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <Input type="password" {...register('password')} placeholder="Contraseña" />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full">Ingresar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

