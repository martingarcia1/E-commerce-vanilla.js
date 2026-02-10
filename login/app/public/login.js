const mensajeError = document.getElementsByClassName("error")[0];
document.getElementById("formulario-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombreUsuario = e.target.children.nombreUsuario.value;
  const contraseña = e.target.children.contraseña.value;
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nombreUsuario, contraseña })
    });
    if (!res.ok) return mensajeError.classList.toggle("escondido", false);
    const resJson = await res.json();
    if (resJson.redirect) {
      window.location.href = resJson.redirect;
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
  }
});