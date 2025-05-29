import { EventEmitter2 } from 'eventemitter2'
import socket from '@/ws/socket'
import { EventType } from './event.interface'

export class EventService {
  private readonly em2: EventEmitter2

  constructor(em2: EventEmitter2){
    this.em2 = em2
    this.registerEvents()
  }

  public em(): EventEmitter2 {
    return this.em2
  }

  private registerEvents(){
    socket.on('connect', () => {
      this.em2.emit(EventType.CONNECT, true)
    })

    socket.on('disconnect', () => {
      this.em2.emit(EventType.CONNECT, false)
    })
  }

}