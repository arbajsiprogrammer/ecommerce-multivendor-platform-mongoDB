const cors_options = {
  origin: process.env.frontend_url || "*",
  credentials: true,
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default cors_options;
