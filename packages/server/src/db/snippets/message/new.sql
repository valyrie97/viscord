INSERT INTO messages
  (`text`, `from`, `uid`, `t_sent`, channel_uid)
  VALUES (
    ?,
    ?,
    ?,
    /* UNIX_TIMESTAMP(), */
    ?,
    ?
  )