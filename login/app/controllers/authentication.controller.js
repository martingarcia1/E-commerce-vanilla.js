import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const usuarios = [
  {
    //contraseña: "$2a$05$nLY2It8riku2vwwDIINdgO/XIyPXRg1Gn9LFgnhwKqC4TwcAwEUL2", // Contraseña encriptada
    nombreUsuario: "admin",
    contraseña: "$2a$10$U60GgDS137kA2vm5CQfIMOGnjEnwegPHAEbRSKlyZjOQoyKJdL/ke", // Contraseña encriptada, admin123
    role: "admin"
  },
  {
    nombreUsuario: "usuario",
    contraseña: "$2a$10$3ZGM71hFjHLbZ578Rfuhs.TFlAYpYXacAAs5c3bIxHcxlLSKQhAAy", // Contraseña encriptada, usuario123
    role: "usuario"
  },
  {
    nombreUsuario: "usuarios",
    contraseña: "$2a$10$ATLRS6B15qNN91g29TixzuewklpA0QK880P7abSealuj84VcJcYSe", // Contraseña encriptada, usuarios123
    role: "usuario"
  }
];

export async function login(req, res) {
  const { nombreUsuario, contraseña } = req.body;
  if (!nombreUsuario || !contraseña) {
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
  }
  const usuarioAResvisar = usuarios.find(usuario => usuario.nombreUsuario === nombreUsuario);
  if (!usuarioAResvisar) {
    return res.status(400).send({ status: "Error", message: "Error durante login" });
  }
  const loginCorrecto = await bcryptjs.compare(contraseña, usuarioAResvisar.contraseña);
  if (!loginCorrecto) {
    return res.status(400).send({ status: "Error", message: "Error durante login" });
  }
  const token = jsonwebtoken.sign(
    { nombreUsuario: usuarioAResvisar.nombreUsuario, role: usuarioAResvisar.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const jwtCookieExpires = Number(process.env.JWT_COOKIE_EXPIRES);
  if (isNaN(jwtCookieExpires)) {
    throw new Error("JWT_COOKIE_EXPIRES debe ser un número válido en el archivo .env");
  }

  const cookieOption = {
    expires: new Date(Date.now() + jwtCookieExpires * 24 * 60 * 60 * 1000),
    httpOnly: true,
    path: "/"
  };

  res.cookie("jwt", token, cookieOption);

  if (usuarioAResvisar.role === 'admin') {
    res.send({ status: "ok", message: "Usuario loggeado", redirect: "/admin" });
  } else {
    res.send({ status: "ok", message: "Usuario loggeado", redirect: "/usuarios" });
  }
}

export async function register(req, res) {
  console.log(req.body);
  const { nombreUsuario, contraseña } = req.body;
  if (!nombreUsuario || !contraseña) {
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
  }
  const usuarioAResvisar = usuarios.find(usuario => usuario.nombreUsuario === nombreUsuario);
  if (usuarioAResvisar) {
    return res.status(400).send({ status: "Error", message: "Este usuario ya existe" });
  }
  const salt = await bcryptjs.genSalt(5);
  const hashcontraseña = await bcryptjs.hash(contraseña, salt);
  const nuevoUsuario = { nombreUsuario, contraseña: hashcontraseña, role: "usuario" };
  console.log(nuevoUsuario);
  usuarios.push(nuevoUsuario);
  return res.status(201).send({ status: "ok", message: `Usuario ${nuevoUsuario.nombreUsuario} agregado` });
}
// Cerrar Sesion
export async function logout(req, res) {

  res.clearCookie("jwt", { path: "/" });
  return res.status(200).send({ status: "ok", message: "Sesión cerrada", redirect: "/" });
}

export const methods = { login, register, logout };
