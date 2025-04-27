export function SignupUser() {
  const name = (document.getElementById('name') as HTMLInputElement).value;
  const email = (document.getElementById('email') as HTMLInputElement).value;
  const password = (document.getElementById('password') as HTMLInputElement).value;

  if (!name || !email || !password) {
    window.dispatchEvent(
      new CustomEvent('toast', {
        detail: {
          message: 'Por favor, llena todos los campos.',
          variant: 'warning'
        }
      })
    )
    return;
  }

  const userData = { name, email, password };

  fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.dispatchEvent(
          new CustomEvent('toast', {
            detail: {
              message: 'Registro exitoso!',
              variant: 'success'
            }
          })
        )
      } else {
        window.dispatchEvent(
          new CustomEvent('toast', {
            detail: {
              message: `'Error en el registro: ${data.message}`,
              variant: 'error'
            }
          })
        )
      }
    })
    .catch(error => {
      window.dispatchEvent(
        new CustomEvent('toast', {
          detail: {
            message: 'Hubo un error al procesar la solicitud.',
            variant: 'error'
          }
        })
      )
      console.error(error);
    });
}
