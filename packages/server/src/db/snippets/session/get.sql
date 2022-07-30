SELECT
  sessions.client_uid as client_uid,
  sessions.expires as expires,
  clients.username as username
FROM sessions
JOIN clients
  ON sessions.client_uid=clients.uid
WHERE
  sessions.expires > UNIX_TIMESTAMP() * 1000
  AND sessions.token=?

LIMIT 1;