import { useContext, useEffect, useState } from "react";
import QR from 'qrcode';
import useHomeServer from "../contexts/PersistentState/useHomeServerNative";
import useClientId from "../hooks/useClientId";

export default function LoginQR() {
  const { homeServer } = useHomeServer()
  const { clientId } = useClientId();
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setQr(await QR.toDataURL(
        'loginv1|' + homeServer + '|' + clientId
      ));
    })()
  }, [clientId, homeServer])

  return <img src={qr ?? undefined} />
}