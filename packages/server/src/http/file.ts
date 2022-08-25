import { Router } from 'express';
import database from '../lib/dbHelpers/database';
import { resolve } from 'path';
import { STORAGE_PATH } from '../constants';
import { createReadStream, lstatSync } from 'fs';

const router = Router();

router.get('/:uid', async (req, res) => {
  const info = await database.get.file.by.uid(req.params.uid);
  res.contentType = info.type;
  if(info.data !== null) {
    res.end(info.data);
    return;
  } else {
    // res.end('new hype');
    const path = resolve(STORAGE_PATH, req.params.uid);
    const size = lstatSync(path).size;
    const stream = createReadStream(path);
    res.header('Content-Length', '' + size);
    stream.pipe(res);
  }
})

export default router;