export interface DataBaseStructure {
  servers: Server[];
}

export interface Server {
  privateid: string;
  publicid:  string;
  notes?:    string;
}
