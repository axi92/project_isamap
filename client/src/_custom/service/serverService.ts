import type { Ref } from 'vue';

export async function createServer(modalServerDescription: Ref, owner: string): Promise<ServerEntry | null> {
  modalServerDescription.value;
  const serverCreatePayload: ServerCreateDto = {
    description: modalServerDescription.value,
    owner: owner,
  };
  const res = await fetch('http://localhost:3000/api/v1/servers/create', {
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify(serverCreatePayload),
    headers: { 'Content-Type': 'application/json' },
  });

  if (res.status === 201) {
    const response = (await res.json()) as ServerEntry;
    return response; // server info
  } else {
    console.error('res.status:', res.status);
    return null; // not logged in
  }
}

export async function getServerList(): Promise<ServerEntry[] | null> {
  const res = await fetch('http://localhost:3000/api/v1/servers/list', {
    credentials: 'include',
    method: 'GEt',
    headers: { 'Content-Type': 'application/json' },
  });
  if (res.status === 200) {
    const response = (await res.json()) as ServerEntry[];
    return response; // server info
  } else {
    console.error('res.status:', res.status);
    return null; // not logged in
  }
}

export interface ServerCreateDto {
  owner: string;
  description: string;
}

export interface ServerEntry extends ServerCreateDto {
  privateId: string;
  publicId: string;
}
