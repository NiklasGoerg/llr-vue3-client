import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWebSocketStore = defineStore('webSocket', () => {
  const socket = ref<WebSocket | null>(null)
  const receivedMessages = ref<string[]>([])
  const receivedRequests = ref<string[]>([])
  const showSnackbar = ref<boolean>(false)

  const connect = (url: string) => {
    socket.value = new WebSocket(url)
    socket.value.onmessage = handleMessage
  }

  const sendMessage = (type: string, message: string) => {
    if (socket.value?.readyState === WebSocket.OPEN) {
      socket.value.send(`${type}:${message}`)
    }
  }

  const handleMessage = (event: MessageEvent) => {
    const [content, messageType] = event.data.split(':')

    console.log('Received message:', content, messageType === 'submit')

    if (messageType === 'submit') {
      showSnackbar.value = true
      receivedRequests.value.push(content + ' von Eda')
      console.log(showSnackbar.value)
    } else if (messageType === 'cancel') {
      showSnackbar.value = false
    }

    receivedMessages.value.push(content + ' von Eda')
  }

  const closeSnackbar = () => {
    showSnackbar.value = false
  }

  return {
    socket,
    receivedMessages,
    receivedRequests,
    showSnackbar,
    connect,
    sendMessage,
    handleMessage,
    closeSnackbar
  }
})

export default useWebSocketStore
