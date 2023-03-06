const config = require('#config')
const { port } = config

module.exports = {
    servers: [
      {
        description: "Development", 
        url: `http://localhost:${port}`, 
      },

      {
        description: "Production", 
        url: `http://localhost:${port}`, 
      },

    ],
  };
  