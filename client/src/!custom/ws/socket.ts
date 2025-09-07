import { reactive } from "vue";
import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

// eslint-disable-next-line no-undef
// const URL = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.hostname + ':' + window.location.port;
const URL = 'http://localhost:3000'

const socket = io(URL);

export const state = reactive({
  connected: false,
  socket: socket
  // fooEvents: [],
  // barEvents: [],
});



socket.on('connect', () => {
  state.connected = true;
});

socket.on('disconnect', () => {
  state.connected = false;
});

socket.on('data', (data) => {
  console.log('socket.ts => on:data:', data)
});

// socket.on("foo", (...args) => {
//   state.fooEvents.push(args);
// });

// socket.on("bar", (...args) => {
//   state.barEvents.push(args);
// });

export default socket;
