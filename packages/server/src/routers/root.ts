import router from '../router';
import message from './message';

export default router({
  up() {
    console.log(Date.now());
  },
  message: message,
});