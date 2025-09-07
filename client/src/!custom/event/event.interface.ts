export interface EventResponse {
  success: boolean
  error?: string
  data?: any
}

export enum EventType {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  STATE = 'state',
  LOGIN = 'login',
  LOGOUT = 'logout',
  DATA = 'data',
  MAPDATA = 'mapdata',
}

export type Events = {
  [EventType.CONNECT]: boolean
  [EventType.DISCONNECT]: boolean
  [EventType.STATE]: EventResponse
  [EventType.LOGIN]: EventResponse
  [EventType.LOGOUT]: EventResponse
  [EventType.DATA]: unknown // or a more specific type if you know it
  [EventType.MAPDATA]: string
}
