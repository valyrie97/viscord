import useSessionToken from "../hooks/useSessionToken"

export default function Logout() {

  const { setSessionToken } = useSessionToken();

  return (
    <button onClick={() => setSessionToken(null)}>LOGOUT</button>
  )
}