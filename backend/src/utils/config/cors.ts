export const options = {
  origin: [
    "http://localhost:4200",
    "https://planitgoeco-frontend.vercel.app", // esta es un ejemplo, lo ajustas luego con tu dominio real
  ],
  credentials: true, // permite enviar cookies en la solicitud 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // métodos permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // headers permitidos
};


  //** Cors es un mecanismo que protege al usuario, impidiendo  que páginas web externas hagan peticiones a tu api con las credenciales del usuario
  //  */