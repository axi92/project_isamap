export interface EventResponse {
  success: boolean
  error?: string
  data?: any
}

export enum EventType {
  CONNECT = 'connect',
  STATE = 'state',
  LOGIN = 'login',
  LOGOUT = 'logout',
  DATA = 'data',
  MAPDATA = 'mapdata',
}