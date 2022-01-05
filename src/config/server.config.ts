export const serverOptions = {
  port: +process.env.PORT,
  cors: {
    origin: process.env.CORS_ORIGINS,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  },
};
