export interface DataBaseStructure {
  servers: ServerEntry[];
}

export interface ServerEntry {
  owner: number;
  privateid: string;
  publicid:  string;
  notes?:    string;
}
