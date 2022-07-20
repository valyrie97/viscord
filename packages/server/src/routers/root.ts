import router from '../router';
import { broadcast } from '../index';

export default router({
  up() {
    console.log(Date.now());
  },
  message(data: string) {
    broadcast('message', data);
  },
});