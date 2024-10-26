const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Restaurant Reservation API",
      version: "1.0.0",
      description: "A simple Express API for managing restaurant reservations",
    },
    servers: [
      {
        url: `http://localhost:3000`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

module.exports = swaggerOptions;
