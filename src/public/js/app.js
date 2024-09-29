const socket = io()

const welcome = document.querySelector('#welcome')
const roomNameForm = welcome.querySelector('form')
const roomList = welcome.querySelector('ul')

const room = document.querySelector('#room')
const messageForm = room.querySelector('#message')
const nicknameForm = room.querySelector('#nickname')

room.hidden = true

const addMessage = (message) => {
  const ul = room.querySelector('ul')
  const li = document.createElement('li')
  li.innerText = message
  ul.appendChild(li)
}

const handleMessageSubmit = (roomName) => {
  const input = messageForm.querySelector('input')
  const message = input.value
  socket.emit('message', message, roomName, () => {
    addMessage(`나: ${message}`)
  })
  input.value = ''
}

const handleNicknameSubmit = (roomName) => {
  const input = nicknameForm.querySelector('input')
  const nickname = input.value
  socket.emit('nickname', nickname, roomName, () => {})
}

const setRoomInfo = (roomName, userCount) => {
  const h3 = room.querySelector('h3')
  h3.innerText = `Room ${roomName} (${userCount})`
}

const showRoom = (roomName, count) => {
  welcome.hidden = true
  room.hidden = false
  setRoomInfo(roomName, count)

  messageForm.addEventListener('submit', (event) => {
    event.preventDefault()
    handleMessageSubmit(roomName)
  })
  nicknameForm.addEventListener('submit', (event) => {
    event.preventDefault()
    handleNicknameSubmit(roomName)
  })
}

const handleRoomSubmit = (event) => {
  event.preventDefault()
  const input = roomNameForm.querySelector('input')
  const roomName = input.value

  socket.emit('enter_room', roomName, showRoom)
  input.value = ''
}

roomNameForm.addEventListener('submit', handleRoomSubmit)

socket.on('welcome', (roomName, user, count) => {
  setRoomInfo(roomName, count)
  addMessage(`${user}님이 입장하셨습니다!`)
})
socket.on('bye', (roomName, user, count) => {
  setRoomInfo(roomName, count)
  addMessage(`${user}님이 떠났습니다.`)
})
socket.on('message', ({ user, message }) => addMessage(`${user}: ${message}`))
socket.on('room_change', (rooms) => {
  roomList.innerHTML = ''
  rooms.forEach((room) => {
    const li = document.createElement('li')
    li.innerText = room
    roomList.append(li)
  })
})
