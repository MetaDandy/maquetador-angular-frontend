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

const signupSchema = z.object({
  name: z.string(),
  email: z.string().email({ message: 'Correo inválido.' }),
  password: z.string().min(6, { message: 'Mínimo de 6 caracteres.' })
});

export default function Home() {
  const { setToken } = useAuth();
  const { setLockScreen, showToast } = useAppStore();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLockScreen({ isVisible: true, type: "loading", content: "Registrando..." });
    try {
      const signup = await fetch(API_ROUTES.SIGNUP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer"
        },
        body: JSON.stringify(data),
      });

      const response = await signup.json();

      console.log(response.err, response.error)
      if (!signup.ok) throw new Error(response || "Error de autenticación");

      setToken(response.token);
      showToast('Registro exitoso', "Bienvenido", "success");
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
          <CardTitle className="text-xl text-gray-800 dark:text-white">Regístrate</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input {...register('name')} placeholder="Nombre" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <Input {...register('email')} placeholder="Correo electrónico" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <Input type="password" {...register('password')} placeholder="Contraseña" />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full">Registrarse</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

