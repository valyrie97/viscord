UPDATE sessions
SET expires=UNIX_TIMESTAMP() * 1000
WHERE token=?;