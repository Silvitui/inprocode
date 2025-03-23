export const options = {
  origin: [
    "http://localhost:4200",
    "https://silvitui.github.io",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};


  //** Cors es un mecanismo que protege al usuario, impidiendo  que páginas web externas hagan peticiones a tu api con las credenciales del usuario
  //  */