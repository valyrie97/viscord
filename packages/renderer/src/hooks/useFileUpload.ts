import { useCallback, useEffect, useState } from "react";
import { useApi } from "../lib/useApi";
import { v4 } from 'uuid';
import { useLog } from "../components/useLog";

const b64 = async (data: Uint8Array) => {
  const base64url = await new Promise((r) => {
    const reader = new FileReader();
    reader.onload = () => r(reader.result);
    reader.readAsDataURL(new Blob([data]));
  });
  // @ts-ignore
  return base64url.split(",", 2)[1];
};

export interface Upload {
  internalId: string;
  externalId: string | null;
  data: Blob;
  reader: any;
  progress: number;
  name: string;
  sent: number;
  rcvd: number;
  uploaded: boolean;
  processed: boolean;
}

// 400 kb
const CHUNK_SIZE = 4_000;

export default function useFileUpload() {
  const [uploads, setUploads] = useState<Upload[]>([]);

  const updateUpload = (clientId: string, newData: Partial<Upload>) => {
    setUploads(uploads => uploads.map(upload => {
      if(upload.internalId !== clientId) return upload;
      return {
        ...upload,
        ...newData,
      };
    }));
  };

  const { send } = useApi({
    'file:new'(data: NewFileResponse) {
      updateUpload(data.clientId, { externalId: data.serverId });
    },
    'file:chunk'(data: FileChunkResponse) {
      updateUpload(data.clientId, { rcvd: data.chunk, progress: data.progress });
    },
    'file:end'(data: FileEndResponse) {
      updateUpload(data.clientId, { processed: true });
    }
  }, []);

  type Shit = {
    chunk: Uint8Array;
    done: boolean;
  }

  const sendNextChunk = async (upload: Upload) => {
    if (upload.externalId === null) return;

    const {chunk, done}: Shit = await new Promise(async (res) => {
      const { value, done } = await upload.reader.read();
      res({
        chunk: value,
        done
      })
    });

    if(chunk === undefined && done) {
      updateUpload(upload.internalId, { uploaded: true });
      const fileEndRequest: FileEndRequest = {
        serverId: upload.externalId,
      }
      send('file:end', fileEndRequest)
      return;
    }

    const chunkb64 = await b64(chunk);
    
    updateUpload(upload.internalId, { sent: upload.sent + 1 });

    const chunkReq: FileChunkRequest = {
      chunk: upload.sent,
      data: chunkb64,
      serverId: upload.externalId,
    };

    send('file:chunk', chunkReq);
  }

  useEffect(() => {
    for(const upload of uploads) {
      if(upload.rcvd === upload.sent && !upload.uploaded) {
        sendNextChunk(upload);
      }
    }
  }, [uploads])

  const newFile = useCallback((name: string, type: string, blob: Blob) => {
    const id = v4();
    const newFileReq: NewFileRequest = {
      clientId: id,
      length: blob.size,
      name,
      type,
    };
    
    // @ts-ignore
    const reader = blob.stream().getReader();

    setUploads(uploads => [...uploads, {
      internalId: id,
      externalId: null,
      data: blob,
      reader: reader,
      progress: 0,
      name,
      sent: 0,
      rcvd: 0,
      uploaded: false,
      processed: false,
    }]);
    send('file:new', newFileReq);
    return id;
  }, []);

  const getInfo = useCallback((clientId: string) => {
    const file = uploads.find(upload => upload.internalId === clientId);
    return file ?? null;
  }, [uploads])

  // useLog(uploads, 'uploads');

  return {
    newFile,
    getFileInfo: getInfo
  }
}