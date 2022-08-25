
import getAllDisplayNames from './get/all/displayNames';
import addFileRaw from './add/file/raw/addFileRaw';
import addFilePath from './add/file/path/addFilePath';
import getFileByUid from './get/file/by/uid';

const database = {
  get: {
    all: {
      displayNames: getAllDisplayNames
    },
    file: {
      by: {
        uid: getFileByUid
      }
    }
  },
  add: {
    file: {
      raw: addFileRaw,
      path: addFilePath
    }
  }
};

export default database;