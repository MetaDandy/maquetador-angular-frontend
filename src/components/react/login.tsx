import { useForm, type SubmitHandler } from "react-hook-form";
import { FetchHelper } from "../../utils/fetch_helper";

interface ILoginInput {
  email: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginInput>();

  const onSubmit: SubmitHandler<ILoginInput> = async (data) => {
    console.log("Iniciando sesión...", data);

    try {
      const result = await FetchHelper({
        token: "",
        baseUrl: "http://127.0.0.1:8000/api/v1/users/login",
        data
      })

      console.log('Login exitoso', result);
      localStorage.setItem("authToken", result.token)
      window.location.href = "/studio"

      window.dispatchEvent(
        new CustomEvent('toast', {
          detail: {
            message: 'Inicio de sesión exitoso.',
            variant: 'success',
          }
        })
      );
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            message: "Hubo un error al comunicarse con el servidor, inténtelo de nuevo.",
            variant: "error",
          },
        })
      );
    }
  };

  return (
    <section className="max-w-md w-full mx-auto my-16">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-6 space-y-2">
          <legend className="fieldset-legend">Inicia Sesión</legend>

          <label htmlFor="email" className="label">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            className="input"
            placeholder="johndoe@example.com"
            {...register("email", {
              required: "El correo electrónico es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "El formato del correo electrónico no es válido",
              },
            })}
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          <label htmlFor="password" className="label">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            className="input"
            {...register("password", { required: "La contraseña es obligatoria" })}
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}

          <button className="btn btn-neutral mt-4" type="submit">
            Inicia Sesión
          </button>
        </fieldset>
      </form>
    </section>
  );
}
