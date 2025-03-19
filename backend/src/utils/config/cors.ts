export const options = {
    origin: "http://localhost:4200", // permite solicitudes solo desde el frontend
    credentials: true, // Permite enviar cookies con las solicitudes
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"] // Headers permitidos
  }

  //** Cors es un mecanismo que protege al usuario, impidiendo  que páginas web externas hagan peticiones a tu api, con las credenciales del usuario
  //  */