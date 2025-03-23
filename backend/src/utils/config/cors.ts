export const options = {
  origin: [
    "https://silvitui.github.io",  // Asegúrate de agregar el dominio de tu frontend
  ],
  credentials: true,  // Permitir el envío de cookies
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};



  //** Cors es un mecanismo que protege al usuario, impidiendo  que páginas web externas hagan peticiones a tu api con las credenciales del usuario
  //  */