import http from 'http'
import express from 'express'
import { Server } from 'socket.io'

const app = express()

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

app.use('/public', express.static(__dirname + '/public'))

app.get('/', (_, res) => res.render('home'))
app.get('/*', (_, res) => res.redirect('/'))

const httpServer = http.createServer(app)
const wsServer = new Server(httpServer)

const getPublicRooms = () => {
  const { sids, rooms } = wsServer.sockets.adapter

  const publicRooms = []
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) publicRooms.push(key)
  })

  return publicRooms
}

wsServer.on('connection', (socket) => {
  socket['nickname'] = '익명'
  wsServer.sockets.emit('room_change', getPublicRooms())
  socket.on('enter_room', (roomName, done) => {
    socket.join(roomName)
    done(roomName)
    socket.to(roomName).emit('welcome', socket.nickname)
    wsServer.sockets.emit('room_change', getPublicRooms())
  })
  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) => socket.to(room).emit('bye', socket.nickname))
  })
  socket.on('disconnect', () => {
    wsServer.sockets.emit('room_change', getPublicRooms())
  })
  socket.on('message', (message, roomName, done) => {
    socket.to(roomName).emit('message', { user: socket.nickname, message })
    done()
  })
  socket.on('nickname', (nickname) => {
    socket['nickname'] = nickname
  })
})

const handleListen = () => console.log(`Listening on http://localhost:3000`)
httpServer.listen(3000, handleListen)
