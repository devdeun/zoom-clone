const messageList = document.querySelector('ul')
const nickNameForm = document.querySelector('#nickname')
const messageForm = document.querySelector('#message')

const socket = new WebSocket(`ws://${window.location.host}`)

socket.addEventListener('open', () => {
  console.log('Connected to server ✅')
})

const renderMessage = (message) => {
  const li = document.createElement('li')
  li.innerText = message
  messageList.append(li)
}

socket.addEventListener('message', (message) => {
  renderMessage(message.data)
})

socket.addEventListener('close', () => {
  console.log('Disconnected from server ❌')
})

const createMessage = (type, payload) => {
  const message = { type, payload }
  return JSON.stringify(message)
}

const handleNicknameSubmit = (event) => {
  event.preventDefault()
  const input = nickNameForm.querySelector('input')
  const nickname = input.value
  socket.send(createMessage('nickname', nickname))
}

const handleMessageSubmit = (event) => {
  event.preventDefault()
  const input = messageForm.querySelector('input')
  const message = input.value
  socket.send(createMessage('message', message))
  renderMessage(message)
  input.value = ''
}

nickNameForm.addEventListener('submit', handleNicknameSubmit)
messageForm.addEventListener('submit', handleMessageSubmit)
