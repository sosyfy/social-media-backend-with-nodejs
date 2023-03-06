const http = require('http')
const app = require('#lib/server')
const config = require('#config')
const dotenv = require('dotenv')
const database = require('#lib/database')

dotenv.config()

const { port } = config
const server = http.createServer(app)

async function main() {
    try {
      await startServer()
    } catch (err) {
      console.log(err);
      process.exit(1)
    }
  }
  
async function startServer() {
    database.connect(config.mongo.uri)
    server.listen(port, onListening )
  }
  
function onListening() {
    console.log({ msg: `listening on http://localhost:${port}` })
  }

main()
