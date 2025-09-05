import socket from '@/!custom/ws/socket'
import { EventType } from './event.interface'
import type { Events } from './event.interface'
import type { Emitter } from 'mitt';

export class EventService {
  private readonly em2: Emitter<Events>;

  constructor(em2: Emitter<Events>) {
    this.em2 = em2;
    this.registerEvents();
  }

  public em(): Emitter<Events> {
    return this.em2
  }

  public requestMapData(publicId: string){
    socket.emit(EventType.MAPDATA, publicId)
  }

  private registerEvents(){
    socket.on('connect', () => {
      this.em2.emit(EventType.CONNECT, true)
    })

    socket.on('disconnect', () => {
      this.em2.emit(EventType.CONNECT, false)
    })

    socket.on('data', (data) => {
      this.em2.emit(EventType.DATA, data)
    })
  }

}
