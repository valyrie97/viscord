
interface NewFileRequest {
  clientId: string;
  length: number;
  name: string;
  type: string;
  $clientId?: string;
}

interface NewFileResponse {
  clientId: string;
  serverId: string;
}

interface FileChunkRequest {
  chunk: number;
  serverId: string;
  data: string;
}

interface FileChunkResponse {
  chunk: number;
  serverId: string;
  clientId: string;
  progress: number;
}

interface FileEndRequest {
  serverId: string;
}

interface FileEndResponse {
  serverId: string;
  clientId: string;
  url: string;
}