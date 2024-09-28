const messageList = document.querySelector('ul')
const messageForm = document.querySelector('form')

const socket = new WebSocket(`ws://${window.location.host}`)

socket.addEventListener('open', () => {
  console.log('Connected to server ✅')
})

socket.addEventListener('message', (message) => {
  console.log('New message:', message.data)
})

socket.addEventListener('close', () => {
  console.log('Disconnected from server ❌')
})

const handleSubmit = (event) => {
  event.preventDefault()
  const input = messageForm.querySelector('input')
  const message = input.value
  socket.send(message)
  input.value = ''
}

messageForm.addEventListener('submit', handleSubmit)
