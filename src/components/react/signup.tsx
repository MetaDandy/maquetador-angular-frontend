import { useForm, type SubmitHandler } from "react-hook-form";
import { FetchHelper } from "../../utils/fetch_helper";

interface IFormInput {
  name: string;
  email: string;
  password: string;
}

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log('Enviando datos...', data);

    try {
      const result = await FetchHelper({
        token: "",
        baseUrl:"http://127.0.0.1:8000/api/v1/users/register",
        data
      })

      console.log('Registro exitoso', result);
      localStorage.setItem("authToken", result.token)
      window.location.href = "/studio"

      window.dispatchEvent(
        new CustomEvent('toast', {
          detail: {
            message: 'Registro exitoso.',
            variant: 'success',
          }
        })
      );
    } catch (error) {
      console.error('Error en la solicitud', error);

      window.dispatchEvent(
        new CustomEvent('toast', {
          detail: {
            message: 'Hubo un error al comunicarse con el servidor, inténtelo de nuevo.',
            variant: 'error',
          }
        })
      );
    }
  };


  return (
    <section className="max-w-md w-full mx-auto my-16">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset
          className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-6 space-y-2"
        >
          <legend className="fieldset-legend">Regístrate</legend>

          <input
            type="text"
            id="name"
            className="input"
            placeholder="John Doe"
            {...register("name", { required: "El nombre es obligatorio" })}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <label htmlFor="email" className="label">Correo electrónico</label>
          <input
            type="email"
            id="email"
            className="input"
            placeholder="johndoe@example.com"
            {...register("email", {
              required: "El correo electrónico es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "El formato del correo electrónico no es válido"
              }
            })}
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          <label htmlFor="password" className="label">Contraseña</label>
          <input
            type="password"
            id="password"
            className="input"
            {...register("password", { required: "La contraseña es obligatoria" })}
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}

          <button className="btn btn-neutral mt-4" type="submit">Regístrate</button>
        </fieldset>
      </form>
    </section>
  )
}