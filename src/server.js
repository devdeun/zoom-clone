import http from 'http'
import express from 'express'
import WebSocket from 'ws'

const app = express()

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

app.use('/public', express.static(__dirname + '/public'))

app.get('/', (_, res) => res.render('home'))
app.get('/*', (_, res) => res.redirect('/'))

const httpServer = http.createServer(app)
const webSocketServer = new WebSocket.Server({ server: httpServer })

const sockets = []
webSocketServer.on('connection', (socket) => {
  sockets.push(socket)
  socket['nickname'] = '익명'
  socket.on('close', () => console.log('Disconnected from the browser ❌'))
  socket.on('message', (message) => {
    const parsedMessage = JSON.parse(message)
    switch (parsedMessage.type) {
      case 'message':
        const newMessage = parsedMessage.payload.toString('utf-8')
        sockets
          .filter((aSocket) => aSocket !== socket)
          .forEach((aSocket) =>
            aSocket.send(`${socket.nickname}: ${newMessage}`)
          )
        break
      case 'nickname':
        socket['nickname'] = parsedMessage.payload
        break
      default:
        break
    }
  })
})

const handleListen = () => console.log(`Listening on http://localhost:3000`)
httpServer.listen(3000, handleListen)
