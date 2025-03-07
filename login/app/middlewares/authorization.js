import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { usuarios } from "../controllers/authentication.controller.js";

dotenv.config();

export const soloPublico = (req, res, next) => {
  if (req.cookies.jwt) {
    return res.redirect("/");
  }
  next();
};

export const soloAdmin = (req, res, next) => {
  if (!req.cookies.jwt) {
    return res.redirect("/");
  }
  try {
    const token = req.cookies.jwt;
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.redirect("/");
    }
    next();
  } catch (error) {
    return res.redirect("/");
  }
};

export const soloUsuario = (req, res, next) => {
  if (!req.cookies.jwt) {
    return res.redirect("/");
  }
  next();
};

function revisarCookie(req) {
  try {
    const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
    const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
    const usuarioAResvisar = usuarios.find(usuario => usuario.nombreUsuario === decodificada.nombreUsuario);
    if (!usuarioAResvisar) return false;
    return usuarioAResvisar;
  } catch {
    return false;
  }
}

export const methods = { soloAdmin, soloUsuario, soloPublico };