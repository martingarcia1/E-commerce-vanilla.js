import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { methods as authentication } from './controllers/authentication.controller.js';
import { methods as authorization } from './middlewares/authorization.js';
import authenticationRoutes from './routes/authentication.routes.js'; // Importar las rutas de autenticación
const __dirname = path.dirname(fileURLToPath(import.meta.url));


// SERVER
const app = express();
app.set("port", process.env.PORT || 3000);

// Configuración (middlewares y rutas) - deben establecerse antes de escuchar
app.use('/api', authenticationRoutes);
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Rutas
app.get("/", authorization.soloPublico, (req, res) => res.sendFile(__dirname + "/pages/login.html"));
app.get("/register", authorization.soloPublico, (req, res) => res.sendFile(__dirname + "/pages/register.html"));
app.get("/admin", authorization.soloAdmin, (req, res) => res.sendFile(__dirname + "/pages/admin/admin.html"));
app.get("/usuario", authorization.soloUsuario, (req, res) => res.sendFile(__dirname + "/pages/usuario.html"));
app.get("/usuarios", authorization.soloUsuario, (req, res) => res.sendFile(__dirname + "/pages/usuarios.html")); // Añadir esta línea si aún no existe
app.post("/api/login", authentication.login);
app.post("/api/register", authentication.register);
app.post("/api/logout", authentication.logout);

// Iniciar servidor (al final, después de configurar middlewares y rutas)
if (process.env.NODE_ENV !== 'production') {
    app.listen(app.get("port"), () => {
        console.log("Servidor corriendo en:", app.get("port"));
    });
}

export default app;