import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { clientIdContext } from './App';
import { useApi } from '../lib/useApi';


export default function NameTextbox() {
  const clientId = useContext(clientIdContext);
  const [name, setName] = useState<string | null>(null);
  const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null);

  const { send } = useApi({
    'client:get'(_name: string) {
      setName(_name);
    },
  }, [name, clientId]);

  const update = useCallback(() => {
    if(inputElement === null) return;
    if(clientId === null) return;
    send('client:rename', {
      clientId: clientId,
      name: inputElement.value,
    });
    setName(inputElement.value);
  }, [clientId, name]);

  useEffect(() => {
    if(clientId === null) return;
    if(inputElement === null) return;
    send('client:get', clientId);
  }, [inputElement, clientId]);

  return <input
    ref={setInputElement}
    value={name ?? ''}
    onChange={update}
  />;
}