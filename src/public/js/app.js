const socket = io()

const welcome = document.querySelector('#welcome')
const form = welcome.querySelector('form')
const room = document.querySelector('#room')

room.hidden = true

const showRoom = (roomName) => {
  welcome.hidden = true
  room.hidden = false
  const h3 = room.querySelector('h3')
  h3.innerText = `Room ${roomName}`
}

const handleRoomSubmit = (event) => {
  event.preventDefault()
  const input = form.querySelector('input')
  const roomName = input.value

  socket.emit('enter_room', roomName, showRoom)
  input.value = ''
}

form.addEventListener('submit', handleRoomSubmit)
