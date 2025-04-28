import { FormInputField } from "@/components/form_input_field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { API_ROUTES } from "@/lib/api.routes";
import useAuthStore from "@/lib/auth.store";
import { FetchHelper } from "@/lib/fetch_helper";
import { getUserIdFromToken } from "@/lib/get_user_id";
import useAppStore from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1, { message: "El título es obligatorio." }),
  description: z.string().optional(),
});

type ProjectSchema = z.infer<typeof projectSchema>

export default function SaveProject() {
  const { showToast, setLockScreen } = useAppStore();
  const { token } = useAuthStore();

  const form = useForm<ProjectSchema>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      description: '',
      title: ''
    },
    mode: "onChange"
  });

  const handleSave = async (data: any) => {
    const sendData = {
      title: data.title,
      description: data.description,
      content: localStorage.getItem('gjsProject'),
      owner_id: getUserIdFromToken(token ?? "")
    }

    try {
      setLockScreen({ isVisible: true, type: "loading", content: "Guardando..." });
      const response = await FetchHelper({
        token: token ?? "",
        data: sendData,
        baseUrl: API_ROUTES.PROJECT
      });
      console.log(response.data)
      showToast('Proyecto creado', "", "success");

      form.reset();
    } catch (error: any) {
      showToast("Error", error.message, "error");
      console.error("Error en la solicitud:", error);
    } finally {
      setLockScreen(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8 ml-3">
        <FormInputField
          control={form.control}
          name="title"
          label="Título del proyecto."
          placeholder="Título del proyecto."
          description="Ingrese un título."
        />
        <FormInputField
          control={form.control}
          name="description"
          label="Descripción del proyecto."
          placeholder="Descripción del proyecto."
          description="Ingrese un proyecto."
        />

        <Button type="submit" className="w-full">Guardar Proyecto</Button>
      </form>
    </Form>
  )
}