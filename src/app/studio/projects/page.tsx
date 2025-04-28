'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAuthStore from "@/lib/auth.store";
import { getUserIdFromToken } from "@/lib/get_user_id";
import { API_ROUTES } from "@/lib/api.routes";
import { useRouter } from "next/navigation";


export default function ProjectPage() {
  const { token } = useAuthStore();
  const router = useRouter();

  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectsByOwner = async (id: string) => {
    const response = await fetch(`${API_ROUTES.PROJECT_OWNER}/${id}?limit=100&offset=0`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los proyectos");
    }

    return response.json(); 
  };

  useEffect(() => {
    if (token) {
      const id = getUserIdFromToken(token);
      fetchProjectsByOwner(id)
        .then((data) => {
          setProjects(data.data);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error.err);
          setIsLoading(false);
        });
    }
  }, [token]);

  if (isLoading) {
    return <div>Cargando proyectos...</div>;
  }

  if (error) {
    return <div>Error al cargar los proyectos: {error}</div>;
  }

  return (
    <div className="space-y-8 mx-5">
      <h1 className="text-2xl font-bold">Proyectos</h1>
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{project.description}</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/studio/projects/${project.id}`)}
                >
                  Seguir editando
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No hay proyectos para mostrar</p>
        </div>
      )}
    </div>
  );
}
