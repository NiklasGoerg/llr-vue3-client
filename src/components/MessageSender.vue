<template>
  <div class="message-sender">
    <v-textarea
      v-model="task"
      label="Aufgabenstellung"
      outlined
      rows="5"
      class="task-textarea"
    ></v-textarea>

    <div class="button-text-container">
      <v-text-field
        v-for="i in 4"
        :key="i"
        v-model="buttons[i - 1]"
        :label="'Button ' + i"
        outlined
        class="button-text-field"
      ></v-text-field>
    </div>
    <div class="button-container">
      <div>
        <v-btn @click="sendTask" color="primary">Senden</v-btn>
        <v-btn @click="clear" color="primary">Clear</v-btn>
      </div>
      <div>
        <v-btn @click="applyTemplate1">Vorlage 1</v-btn>
        <v-btn @click="applyTemplate2">Vorlage 2</v-btn>
      </div>
    </div>
    <div class="protocol-container" ref="protocolContainer">
      <div v-if="protocol.length === 0" class="empty-protocol">Keine Nachrichten</div>
      <div v-else class="protocol">
        <div v-for="(message, index) in protocol" :key="index" class="protocol-message">
          {{ message }}
        </div>
      </div>
    </div>
    <v-snackbar v-model="showSnackbar" :timeout="-1" color="info">
      {{ protocol[protocol.length - 1] }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="closeSnackbar"> Schließen </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useWebSocketStore } from '@/stores/websocket'

const task = ref('')
const buttons = ref(['', '', '', ''])
const protocol = ref<string[]>([])
const showSnackbar = ref<boolean>(false)

const applyTemplate1 = () => {
  task.value = 'Thema: Das Leben im alten Ägypten'
  buttons.value = ['Hilfe', 'Dringende Hilfe', 'Zu schnell', 'Zu langsam']
}

const applyTemplate2 = () => {
  task.value =
    'Löse die folgende Matheaufgabe: Berechne den Umfang und die Fläche eines Rechtecks mit den Seitenlängen 8cm und 12cm.'
  buttons.value = ['Hilfe', 'Dringende Hilfe', 'Zu laut', 'Bin fertig']
}

const sendTask = () => {
  if (task.value !== '') {
    useWebSocketStore().sendMessage('task', task.value)
  }
  buttons.value.forEach((buttonText, index) => {
    if (buttonText !== '') {
      useWebSocketStore().sendMessage('button' + (index + 1), buttonText)
    }
  })
}

const clear = () => {
  task.value = ''
  buttons.value = ['', '', '', '']
}

useWebSocketStore().connect('ws://localhost:3000')

watch(useWebSocketStore().receivedRequests, (request) => {
  if (request.length > protocol.value.length) {
    protocol.value.push(...request.slice(protocol.value.length))
    nextTick(() => scrollToBottom())
  }
})

const scrollToBottom = () => {
  const protocolContainer = document.getElementById('protocol-container')
  if (protocolContainer) {
    protocolContainer.scrollTop = protocolContainer.scrollHeight
  }
}

watch(
  () => useWebSocketStore().showSnackbar,
  (value) => {
    showSnackbar.value = value
  }
)

const closeSnackbar = () => {
  useWebSocketStore().closeSnackbar()
}
</script>
<style scoped>
.message-sender {
  padding: 20px;
  width: 40rem;
}

.task-textarea {
  width: 100%;
}

.button-text-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.button-text-field {
  flex: 1;
  margin-right: 10px;
}

.protocol-container {
  height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  margin-top: 20px;
}

.empty-protocol {
  padding: 10px;
}

.protocol {
  padding: 10px;
}

.protocol-message {
  margin-bottom: 5px;
}
.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.button-container > div {
  display: flex;
  gap: 0.5rem;
}
</style>
