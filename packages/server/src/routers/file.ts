import router from "../lib/router";
import { reply } from "../lib/WebSocketServer";
import { v4 } from 'uuid';
import tmp from 'tmp';
import { writeFile, createWriteStream, WriteStream, readFile, createReadStream } from 'fs';
import database from "../lib/dbHelpers/database";
import { resolve } from 'path';
import { STORAGE_PATH } from "../constants";

function createFile(id: string): WriteStream {
  return createWriteStream(resolve(STORAGE_PATH, id));
}

interface ServerUpload {
  clientId: string;
  serverId: string;
  length: number;
  authorId: string;
  chunk: number;
  progress: number;
  type: string;
  // tmp file
  path: string;
  writeStream: WriteStream,
  remove: Function;
}



const tempFiles: ServerUpload[] = [];

export default router({
  async 'new'(data: NewFileRequest) {
    if(typeof data.$clientId === 'undefined') return;
    const serverId = v4();
    const temp = tmp.fileSync();
    const writeStream = createWriteStream(temp.name, 'base64');
    tempFiles.push({
      clientId: data.clientId,
      authorId: data.$clientId,
      length: data.length,
      path: temp.name,
      writeStream,
      remove: temp.removeCallback,
      serverId,
      chunk: 0,
      progress: 0,
      type: data.type,
    });
    const res: NewFileResponse = {
      serverId,
      clientId: data.clientId
    };
    return reply(res);
  },
  async 'chunk'(data: FileChunkRequest) {
    const upload = tempFiles.find(upload => upload.serverId === data.serverId);
    if(!upload) return;
    if(data.chunk !== upload.chunk) return;
    if(upload.writeStream.bytesWritten >= upload.length) return;

    await new Promise((res, rej) => {
      upload.writeStream.write(data.data, (err) => {
        if(err) rej(err);
        res(undefined);
      });
    });

    // if(upload.buffer.length === upload.length) {
    //   await new Promise((res, rej) => {
    //     upload.writeStream.close((err) => {
    //       if(err) rej(err);
    //       console.log('upload file closed!');
    //       res(undefined);
    //     });
    //   });
    // }

    upload.chunk ++;
    upload.progress = upload.writeStream.bytesWritten;
    // upload.buffer += data.data;

    // await new Promise(res => setTimeout(res, 300));

    const res: FileChunkResponse = {
      chunk: upload.chunk,
      serverId: upload.serverId,
      clientId: upload.clientId,
      progress: (upload.progress / upload.length)
    }

    return reply(res);

  },
  async 'end'(data: FileEndRequest) {
    const upload = tempFiles.find(upload => upload.serverId === data.serverId);
    if(!upload) return;
    // if(upload.buffer.length !== upload.length) return;
    await new Promise(res => upload.writeStream.close(res));

    if(upload.length > 100_000_000) {
      const read = createReadStream(upload.path);
      const write = createFile(upload.serverId);
      const pipe = read.pipe(write);
      await new Promise((res) => {
        pipe.on('finish', () => {
          res(undefined)
        });
      });

      await database.add.file.path(
        upload.serverId,
        upload.authorId,
        upload.type
      );
    } else {
      const file: Buffer = await new Promise((res, rej) => {
        readFile(upload.path, (err, data) => {
          if(err) rej(err);
          res(data);
        })
      });
  
      await database.add.file.raw(
        upload.serverId,
        upload.authorId,
        file,
        upload.type
      );
    }

    const res: FileEndResponse = {
      serverId: upload.serverId,
      clientId: upload.clientId,
      url: `https://dev.valnet.xyz/files/${upload.serverId}`
    }
    return reply(res);

  }
});

// 012345 67 0123 4567 01 234567
// 012345 01 2345 0123 45 012345