INSERT INTO viscord.messages
  (`text`, `from`, `uid`, `t_sent`)
  VALUES (
    ?,
    ?,
    ?,
    UNIX_TIMESTAMP()
  )