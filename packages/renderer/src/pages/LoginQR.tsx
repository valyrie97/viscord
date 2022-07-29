import { useContext, useEffect, useState } from "react";
import { ClientIdContext, HomeServerContext } from "./App";
import QR from 'qrcode';

export default function LoginQR() {
  const { homeServer } = useContext(HomeServerContext);
  const { clientId } = useContext(ClientIdContext);
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