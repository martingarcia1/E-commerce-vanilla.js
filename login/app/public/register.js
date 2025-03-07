const mensajeError = document.getElementsByClassName("error")[0];
document.getElementById("formulario-registro").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombreUsuario = e.target.children.nombreUsuario.value;
    const contraseña = e.target.children.contraseña.value;
    try {
        const res = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nombreUsuario, contraseña })
        });
        if (!res.ok) return mensajeError.classList.toggle("escondido", false);
        const resJson = await res.json();
        if (resJson.status === "ok") {
            window.location.href = "/"; // Redirigir al formulario de login
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
    }
});